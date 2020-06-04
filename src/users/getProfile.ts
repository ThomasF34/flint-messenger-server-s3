import { Request, Response } from 'express';
import { User } from './model';

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) throw Error('Anonymous request');
    const user = await User.findById((req.user as any)._id);
    if (!user) throw Error('User not found');
    res.json(user.getSafeProfile());
  } catch (error) {
    res.status(500).send();
  }
}
