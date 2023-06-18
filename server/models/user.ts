import { model, Schema, Document } from 'mongoose';
import Course, { ICourse, CourseSchema } from './course';


export interface IUser extends Document {
    userId: string;
    courses: ICourse[];
  }
  
  const UserSchema: Schema<IUser> = new Schema<IUser>({
    userId: { type: String, required: true },
    courses:  [CourseSchema],
  });
  
  export default model<IUser>("User", UserSchema)
  