import { Request, Response, NextFunction } from 'express';
import { User } from './model';

export async function deleteProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw Error('Anonymous request');
    await User.deleteOne({ _id: (req.user as any)._id });
    req.logout();
    res.send();
  } catch (error) {
    next(error);
  }
}
