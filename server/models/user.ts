import mongoose, { model, Schema, Document } from "mongoose";
import { ICourse } from "./course";

export interface IUser extends Document {
  userId: string;
  courses: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
});


const User = mongoose.model('User', userSchema);

export default User;