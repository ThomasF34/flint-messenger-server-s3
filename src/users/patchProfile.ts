import { Request, Response } from 'express';
import { User } from './model';

export async function patchProfile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) throw Error('Anonymous request');
    const user = await User.findById((req.user as any)._id);
    if (!user) throw Error('User not found');
    const { password, ...info } = req.body;
    user.overwrite(info);
    if (password) user.setPassword(password);
    res.json(user.getSafeProfile());
  } catch (error) {
    res.status(500).send();
  }
}
