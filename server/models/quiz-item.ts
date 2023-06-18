import { model, Schema, Document } from 'mongoose';

export interface IQuizItem extends Document {
  question: string;
  answer: string;
}

const QuizItemSchema: Schema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

export { QuizItemSchema}
export default model<IQuizItem>("QuizItem", QuizItemSchema)
