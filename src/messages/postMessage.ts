import { Request, Response } from 'express';
import { Message } from './model';

export async function postMessage(req: Request, res: Response): Promise<void> {
  try {
    const message = await Message.create(req.body);
    res.json(message.toJSON());
  } catch (error) {
    res.status(500).send();
  }
}
