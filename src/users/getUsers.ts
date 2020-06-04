import { Request, Response } from 'express';
import { User } from './model';

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await User.find({}, '_id lastName firstName status').lean();
    res.json(users);
  } catch (error) {
    res.status(500).send();
  }
}
