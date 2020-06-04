import { Request, Response, NextFunction } from 'express';
import { User } from './model';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { password, ...info } = req.body;
    const user = new User({ ...info });
    user.setPassword(password);
    await user.save();
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json(user);
    });
  } catch (error) {
    next(error);
  }
}
