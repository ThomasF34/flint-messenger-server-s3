import { Request, Response, NextFunction } from 'express';
import { User } from './model';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    console.log(req.body);
    const { password, ...info } = req.body;
    const user = new User({ ...info });
    user.setPassword(password);
    await user.save();
    await req.logIn(user, (err) => {
      if (err) return next(err);
      res.json(user.getSafeProfile());
    });
  } catch (error) {
    next(error);
  }
}
