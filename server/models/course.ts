import { model, Schema, Document } from 'mongoose';
import QuizItem, { IQuizItem } from './quiz-item';


export interface ICourse extends Document {
    name: string;
    quiz: IQuizItem[];
  }
  
  const CourseSchema: Schema = new Schema({
    name: { type: String, required: true },
    quiz:  [{ type: Schema.Types.ObjectId, ref: 'QuizItem' }],
  });
  
  export default model<ICourse>("Course", CourseSchema)
  