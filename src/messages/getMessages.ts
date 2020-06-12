import { Request, Response, NextFunction } from 'express';
import { Message } from './model';

export async function getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw Error('Anonymous request');
    const userId = (req.user as any)._id;
    const messages = await Message.find({ $or: [{ emitter: userId }, { targets: userId }] }, null, { lean: true });
    res.json(messages);
  } catch (error) {
    next(error);
  }
}
