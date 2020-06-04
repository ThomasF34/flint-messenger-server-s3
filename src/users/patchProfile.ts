import { Request, Response, NextFunction } from 'express';
import { User } from './model';

export async function patchProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw Error('Anonymous request');
    const user = await User.findById((req.user as any)._id);
    if (!user) throw Error('User not found');
    const { firstName, lastName, password } = req.body;
    console.log(user);
    user.firstName = firstName;
    user.lastName = lastName;
    if (password) user.setPassword(password);
    await user.save();
    res.json(user.getSafeProfile());
  } catch (error) {
    next(error);
  }
}
