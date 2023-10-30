import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    userId: string;
    quizzes: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
    }],
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.userId;
    return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;