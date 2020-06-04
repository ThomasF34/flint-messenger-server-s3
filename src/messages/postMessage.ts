import { Request, Response, NextFunction } from 'express';
import { Message } from './model';

export async function postMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw Error('Anonymous request');
    const emitter = (req.user as any)._id;
    const message = await Message.create({ ...req.body, emitter });
    res.json(message.toJSON());
  } catch (error) {
    next(error);
  }
}
