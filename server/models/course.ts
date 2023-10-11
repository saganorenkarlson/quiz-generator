import { IQuizItem } from './quiz-item';
import { Document, ObjectId } from 'mongoose';
import quizItemSchema from './quiz-item';
import mongoose from 'mongoose';

export interface ICourse extends Document {
  name: string;
  quiz: IQuizItem[];
}

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quiz: [quizItemSchema],
});

const Course = mongoose.model('Course', courseSchema);

export default Course;