import { Request, Response, NextFunction } from 'express';
import { Message } from './model';

export async function getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const messages = await Message.find({}, null, { lean: true });
    res.json(messages);
  } catch (error) {
    next(error);
  }
}
