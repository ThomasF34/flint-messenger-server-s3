import { Request, Response, NextFunction } from 'express';
import joi from '@hapi/joi';
import { User } from './model';

const schema = joi.object({
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

export async function patchProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw Error('Anonymous request');
    const user = await User.findById((req.user as any)._id);
    if (!user) throw Error('User not found');
    const { firstName, lastName, password } = req.body;
    const { error } = schema.validate({ firstName, lastName, password });
    if (error) throw error;
    user.firstName = firstName;
    user.lastName = lastName;
    if (password) user.setPassword(password);
    await user.save();
    res.json(user.getSafeProfile());
  } catch (error) {
    next(error);
  }
}
