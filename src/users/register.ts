import { Request, Response, NextFunction } from 'express';
import joi from '@hapi/joi';
import { User } from './model';

const schema = joi.object({
  email: joi
    .string()
    .pattern(/^[a-z0-9-.]+@[a-z0-9-.]+\.[a-z]+$/i)
    .required(),
  firstName: joi
    .string()
    .pattern(/^[a-zA-Z]{1,20}$/i)
    .required(),
  lastName: joi
    .string()
    .pattern(/^[a-zA-Z]{1,20}$/i)
    .required(),
  password: joi.string().min(8).max(20),
});

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, firstName, lastName, password } = req.body;
    const { error } = schema.validate({ email, firstName, lastName, password });
    if (error) throw error;
    const user = new User({ email, firstName, lastName });
    user.setPassword(password);
    await user.save();
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json(user.getSafeProfile());
    });
  } catch (error) {
    next(error);
  }
}
