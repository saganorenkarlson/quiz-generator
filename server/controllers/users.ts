import User, { IUser } from "../models/user"
import Course, { ICourse } from "../models/course"
import { Request, Response } from 'express'
import { IQuizItem } from "../models/quiz-item";
import OpenAI from 'openai';
import dotenv from "dotenv";
const ObjectId = require('mongodb').ObjectId;

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const fetchUser = async (req: Request, res: Response) => {
  const userId = req.auth?.payload.sub;

  try {
    const existingUser = await User.findOne({ userId: userId }).populate('courses').exec();
    if (!existingUser) {
      const newUser: IUser = new User({ userId });
      await newUser.save();
      return res.status(201).json(newUser);
    }
    return res.status(200).json(existingUser);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const addCourse = async (req: Request, res: Response) => {
  const userId = req.auth?.payload.sub;
  const courseName = req.body.name;
  const courseMaterial = req.body.courseMaterial;
  const numberOfQuestions = req.body.numberOfQuestions;
  const username = req.body.userName;
  const prompt = `From the following material generate ${numberOfQuestions} questions with answers to help studying the material. Give it in this format: [{"question": "question here", "answer": "answer here"}, {"question": "another question", "answer": "another answer"}]. Material: ${courseMaterial}`;

  try {

    const user = await User.findOne({ userId: userId }).exec();
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": prompt }],
    });

    const course: ICourse = new Course({ name: courseName, createdBy: { username: username, id: user._id }, public: false });
    if (chatCompletion.choices[0].message.content) course.quiz = JSON.parse(chatCompletion.choices[0].message.content);

    await course.save();
    user.courses.push(course._id);
    await user.save();

    res.status(201).send(course);
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
};

export const addExistingCourse = async (req: Request, res: Response) => {
  const userId = req.auth?.payload.sub;
  const courseId = req.body.courseId;

  try {
    const user = await User.findOne({ userId }).exec();
    const course = await Course.findById(courseId).exec();

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }

    if (user.courses.includes(courseId)) {
      return res.status(400).send({ error: 'Course already added to the user' });
    }

    user.courses.push(courseId);
    await user.save();

    const populatedUser = await User.findOne({ userId }).populate('courses').exec();

    res.status(200).send(populatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};


export const addQuizItemsToCourse = async (req: Request, res: Response) => {
  const courseId = req.params.courseid;
  const courseMaterial = req.body.courseMaterial;
  const numberOfQuestions = req.body.numberOfQuestions;
  const prompt = `From the following material generate ${numberOfQuestions} questions with answers to help studying the material. Give it in this format: [{"question": "question here", "answer": "answer here"}, {"question": "another question", "answer": "another answer"}]. Material: ${courseMaterial}`;

  try {
    const course = await Course.findById(courseId).exec();
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": prompt }],
    });

    if (chatCompletion.choices[0].message.content) course.quiz.push(...JSON.parse(chatCompletion.choices[0].message.content));
    await course.save();
    res.status(200).send(course);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateQuizItem = async (req: Request, res: Response) => {
  const courseId = req.params.courseid;
  const quizItemId = req.params.quizitemid;
  try {
    const course = await Course.findById(courseId).exec();
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }

    const newQuizItem = req.body;

    const index = course.quiz.findIndex((item) => item.id === quizItemId);

    if (index !== -1) {
      course.quiz[index] = newQuizItem;
    } else {
      return res.status(404).send({ error: 'Quiz item not found' });
    }

    await course.save();
    res.status(200).send(course);
  } catch (error) {
    res.status(400).send(error);
  }

}

export const deleteQuizItem = async (req: Request, res: Response) => {
  const courseId = req.params.courseid;
  const quizItemId = req.params.quizitemid;
  try {
    const course = await Course.findById(courseId).exec();
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }

    const newQuiz = course.quiz.toObject().filter((item: IQuizItem) => !item._id.equals(quizItemId));
    course.quiz = newQuiz;

    await course.save();
    res.status(200).send(course);
  } catch (error) {
    res.status(400).send(error);
  }
}

export const updateCoursePublicStatus = async (req: Request, res: Response) => {
  const courseId = req.params.courseid;
  const isPublic = req.body.isPublic;

  if (typeof isPublic !== 'boolean') {
    return res.status(400).json({ error: 'Invalid input: isPublic should be a boolean' });
  }

  try {
    const course = await Course.findById(courseId).exec();
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }

    course.public = isPublic;

    await course.save();
    res.status(200).send(course);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

export const searchCourses = async (req: Request, res: Response) => {
  const { term, page = 1, pageSize = 10, filter = 'course' } = req.query;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  const searchCriteria = {
    ...(
      filter === 'course' 
      ? { name: new RegExp(term as string, 'i') } 
      : { ['createdBy.username']: new RegExp(term as string, 'i') }
    ),
    public: true
  };
  try {
    const [courses, total] = await Promise.all([
      Course.find(searchCriteria)
        .skip(skip)
        .limit(limit)
        .exec(),
      Course.countDocuments(searchCriteria),
    ]);
    return res.status(200).json({ courses, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const deleteCourse = async (req: Request, res: Response) => {
  const userId = req.auth?.payload.sub;
  const courseId = req.body.courseId;

  try {

    const user = await User.findOne({ userId }).exec();
    const course = await Course.findById(courseId).exec();

    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }

    if(user?._id.toString() !== course.createdBy.id ) {
      return res.status(404).send({ error: 'Not allowed to delete course' });
    }

    await Course.deleteOne({ _id: courseId });
    res.status(200).send({ message: 'Course successfully deleted' });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

export const removeCourseFromUser = async (req: Request, res: Response) => {
  const userId = req.auth?.payload.sub;
  const courseId = req.body.courseId;

  try {
    const user = await User.findOne({ userId }).exec();
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const courseIndex = user.courses.indexOf(new ObjectId(courseId));
    if (courseIndex === -1) {
      return res.status(404).send({ error: 'Course not found in user\'s list' });
    }

    user.courses.splice(courseIndex, 1);
    await user.save();
    res.status(200).send({ message: 'Course removed from user\'s list' });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};