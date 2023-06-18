import { model, Schema, Document } from 'mongoose';
import QuizItem, { IQuizItem, QuizItemSchema } from './quiz-item';


export interface ICourse extends Document {
    name: string;
    quiz: IQuizItem[];
  }
  
  const CourseSchema: Schema = new Schema({
    name: { type: String, required: true },
    quiz:  [QuizItemSchema],
  });
  
  export {CourseSchema};
  export default model<ICourse>("Course", CourseSchema)
  