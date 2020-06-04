import { Request, Response } from 'express';
import { Message } from './model';

export async function getMessages(req: Request, res: Response): Promise<void> {
  try {
    const messages = await Message.find({}, null, { lean: true });
    res.json(messages);
  } catch (error) {
    res.status(500).send();
  }
}
