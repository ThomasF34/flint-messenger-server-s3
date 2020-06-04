import { Request, Response } from 'express';
import { User } from './model';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    console.log(req.body);
    const { password, ...info } = req.body;
    const user = new User({ ...info });
    user.setPassword(password);
    await user.save();
    res.json(user.getSafeProfile());
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
}
