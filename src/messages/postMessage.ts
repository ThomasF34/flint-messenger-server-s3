import { Request, Response, NextFunction } from 'express';
import { Message } from './model';

export async function postMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const message = await Message.create(req.body);
    res.json(message.toJSON());
  } catch (error) {
    next(error);
  }
}
