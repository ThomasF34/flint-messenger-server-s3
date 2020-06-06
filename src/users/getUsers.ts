import { Request, Response, NextFunction } from 'express';
import { User } from './model';

export async function getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await User.find({}, '_id lastName firstName status updatedAt').lean();
    res.json(users);
  } catch (error) {
    next(error);
  }
}
