import User, { IUser } from "../models/user"
import Course, { ICourse } from "../models/course"
import { Request, Response } from 'express'
import { IQuizItem } from "../models/quiz-item";
import OpenAI from 'openai';
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const createUser = async (req: Request, res: Response) => {
  const userId = req.auth?.payload.sub;

  try {
    const existingUser = await User.findOne({ userId }).exec();
    if (existingUser) {
      return res.status(201).json('User already exists');
    }
    const newUser: IUser = new User({ userId });
    await newUser.save();

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }

}

export const fetchUser = async (req: Request, res: Response) => {
  const userId = req.auth?.payload.sub;

  try {
    const existingUser = await User.findOne({ userId: userId }).populate('courses').exec();
    if (!existingUser) {
      return res.status(409).json({ error: 'User does not exist' });
    }
    return res.status(201).json(existingUser);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const addCourse = async (req: Request, res: Response) => {
  const userId = req.auth?.payload.sub;
  const courseName = req.body.name;
  const courseMaterial = req.body.courseMaterial;
  const numberOfQuestions = req.body.numberOfQuestions;
  const prompt = `From the following material generate ${numberOfQuestions} questions with answers to help studying the material. Give it in this format: [{"question": "question here", "answer": "answer here"}, {"question": "another question", "answer": "another answer"}]. Material: ${courseMaterial}`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": prompt }],
    });

    const course: ICourse = new Course({name: courseName});
    if (chatCompletion.choices[0].message.content) course.quiz = JSON.parse(chatCompletion.choices[0].message.content);

    await course.save();
    const user = await User.findOne({ userId: userId }).exec();
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    user.courses.push(course._id);
    await user.save();

    res.status(201).send(course);
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
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