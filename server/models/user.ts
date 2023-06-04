import { model, Schema, Document } from 'mongoose';
import Course, { ICourse } from './course';


export interface IUser extends Document {
    name: string;
    courses: ICourse[];
  }
  
  const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    courses:  [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  });
  
  export default model<IUser>("User", UserSchema)
  