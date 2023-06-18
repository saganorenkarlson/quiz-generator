import User, {IUser} from "../models/user"
import {Request, Response} from 'express'


export const createUser = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const existingUser = await User.findOne({ userId }).exec();

    if (existingUser) {
      return res.status(201).json('User already exists');
    }
    const newUser: IUser = new User({ userId });
    await newUser.save();

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }

}

export const fetchUser = async (req: Request, res: Response) => {
  const { userId } = req.query; 
  try {
    const existingUser = await User.findOne({ userId: userId }).exec();
    if (!existingUser) {
      return res.status(409).json({ error: 'User does not exist' });
    }
    return res.status(201).json(existingUser);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
