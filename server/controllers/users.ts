import User, { IUser } from "../models/user"
import Quiz, { IQuiz } from "../models/quiz"
import { Request, Response } from 'express'
import { IQuizItem } from "../models/quiz-item";
import OpenAI from 'openai';
import dotenv from "dotenv";
import { Console } from "console";
const ObjectId = require('mongodb').ObjectId;

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const fetchUser = async (req: Request, res: Response) => {
  const userId = req.auth?.payload.sub;

  try {
    const existingUser = await User.findOne({ userId: userId }).populate('quizzes').exec();
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

export const addQuiz = async (req: Request, res: Response) => {
  const userId = req.auth?.payload.sub;
  const quizName = req.body.name;
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

    const quiz: IQuiz = new Quiz({ name: quizName, createdBy: { username: username, id: user._id }, public: false });
    if (chatCompletion.choices[0].message.content) quiz.quiz = JSON.parse(chatCompletion.choices[0].message.content);

    await quiz.save();
    user.quizzes.push(quiz._id);
    await user.save();

    res.status(201).send(quiz);
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
};

export const addExistingQuiz = async (req: Request, res: Response) => {
  const userId = req.auth?.payload.sub;
  const quizId = new ObjectId(req.params.quizid);

  try {
    const user = await User.findOne({ userId }).exec();
    const quiz = await Quiz.findById(quizId).exec();

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    if (!quiz) {
      return res.status(404).send({ error: 'Quiz not found' });
    }

    if (user.quizzes.includes(quizId)) {
      return res.status(400).send({ error: 'Quiz already added to the user' });
    }

    user.quizzes.push(quizId);
    await user.save();

    const populatedUser = await User.findOne({ userId }).populate('quizzes').exec();

    res.status(200).send(populatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

export const addQuizItemsToQuiz = async (req: Request, res: Response) => {
  const quizId = req.params.quizid;
  const courseMaterial = req.body.courseMaterial;
  const numberOfQuestions = req.body.numberOfQuestions;
  const prompt = `From the following material generate ${numberOfQuestions} questions with answers to help studying the material. Give it in this format: [{"question": "question here", "answer": "answer here"}, {"question": "another question", "answer": "another answer"}]. Material: ${courseMaterial}`;

  try {
    const quiz = await Quiz.findById(quizId).exec();
    if (!quiz) {
      return res.status(404).send({ error: 'Quiz not found' });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": prompt }],
    });

    if (chatCompletion.choices[0].message.content) quiz.quiz.push(...JSON.parse(chatCompletion.choices[0].message.content));
    await quiz.save();
    res.status(200).send(quiz);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateQuizItem = async (req: Request, res: Response) => {
  const quizId = req.params.quizid;
  const quizItemId = req.params.quizitemid;
  try {
    const quiz = await Quiz.findById(quizId).exec();
    if (!quiz) {
      return res.status(404).send({ error: 'Quiz not found' });
    }

    const newQuizItem = req.body;

    const index = quiz.quiz.findIndex((item) => item.id === quizItemId);

    if (index !== -1) {
      quiz.quiz[index] = newQuizItem;
    } else {
      return res.status(404).send({ error: 'Quiz item not found' });
    }

    await quiz.save();
    res.status(200).send(quiz);
  } catch (error) {
    res.status(400).send(error);
  }

}

export const deleteQuizItem = async (req: Request, res: Response) => {
  const quizId = req.params.quizid;
  const quizItemId = req.params.quizitemid;
  try {
    const quiz = await Quiz.findById(quizId).exec();
    if (!quiz) {
      return res.status(404).send({ error: 'Quiz not found' });
    }

    const newQuiz = quiz.quiz.toObject().filter((item: IQuizItem) => !item._id.equals(quizItemId));
    quiz.quiz = newQuiz;

    await quiz.save();
    res.status(200).send(quiz);
  } catch (error) {
    res.status(400).send(error);
  }
}

export const updateQuizPublicStatus = async (req: Request, res: Response) => {
  const quizId = req.params.quizid;
  const isPublic = req.body.isPublic;

  if (typeof isPublic !== 'boolean') {
    return res.status(400).json({ error: 'Invalid input: isPublic should be a boolean' });
  }

  try {
    const quiz = await Quiz.findById(quizId).exec();
    if (!quiz) {
      return res.status(404).send({ error: 'Quiz not found' });
    }

    quiz.public = isPublic;

    await quiz.save();
    res.status(200).send(quiz);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

export const searchQuizzes = async (req: Request, res: Response) => {
  const { term, page = 1, pageSize = 10, filter = 'quiz' } = req.query;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  const searchCriteria = {
    ...(
      filter === 'quiz' 
      ? { name: new RegExp(term as string, 'i') } 
      : { ['createdBy.username']: new RegExp(term as string, 'i') }
    ),
    public: true
  };
  try {
    const [quizzes, total] = await Promise.all([
      Quiz.find(searchCriteria)
        .skip(skip)
        .limit(limit)
        .exec(),
      Quiz.countDocuments(searchCriteria),
    ]);
    return res.status(200).json({ quizzes, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const deleteQuiz = async (req: Request, res: Response) => {
  const userId = req.auth?.payload.sub;
  const quizId = req.params.quizid;

  try {

    const user = await User.findOne({ userId }).exec();
    const quiz = await Quiz.findById(quizId).exec();

    if (!quiz) {
      return res.status(404).send({ error: 'Quiz not found' });
    }

    if(user?._id.toString() !== quiz.createdBy.id ) {
      return res.status(404).send({ error: 'Not allowed to delete quiz' });
    }

    await Quiz.deleteOne({ _id: quizId });
    res.status(200).send({ message: 'Quiz successfully deleted' });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

export const removeQuizFromUser = async (req: Request, res: Response) => {
  const userId = req.auth?.payload.sub;
  const quizId = req.params.quizid;

  try {
    const user = await User.findOne({ userId }).exec();
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const quizIndex = user.quizzes.indexOf(new ObjectId(quizId));
    if (quizIndex === -1) {
      return res.status(404).send({ error: 'Quiz not found in user\'s list' });
    }

    user.quizzes.splice(quizIndex, 1);
    await user.save();
    res.status(200).send({ message: 'Quiz removed from user\'s list' });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};