import { IQuizItem } from './quiz-item';
import { Document } from 'mongoose';
import quizItemSchema from './quiz-item';
import mongoose from 'mongoose';

export interface IQuiz extends Document {
  name: string;
  quiz: IQuizItem[];
  createdBy: {
    username: string;
    id: string;
  };
  public: boolean;
}

const quizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quiz: [quizItemSchema],
  createdBy: {
    type: {
      username: {
        type: String,
        required: true
      },
      id: {
        type: String,
        required: true
      }
    },
    required: true
  },
  public: {
    type: Boolean,
    required: true
  }
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;