import mongoose, { Document } from "mongoose";

export interface IQuizItem extends Document {
  question: string;
  answer: string;
}

const quizItemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

export default quizItemSchema;