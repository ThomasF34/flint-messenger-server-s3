import { Request, Response, NextFunction } from 'express';
import joi from '@hapi/joi';
import { Message } from './model';
import { User } from '../users';
import { io } from '../socket';

const schema = joi.object({
  conversationId: joi.string().base64().required(),
  target: joi.string().max(60).required(),
  content: joi.string().max(1000).required(),
});

export async function postMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw Error('Anonymous request');
    const emitter = (req.user as any)._id;
    const { error } = schema.validate(req.body);
    if (error) throw error;
    const message = await Message.create({ ...req.body, emitter });
    res.json(message.toJSON());

    const user = await User.findById(message.target);
    const socketId = user?.socket;
    if (socketId) {
      io.to(socketId).emit('chat-message', message.toJSON());
    }
  } catch (error) {
    next(error);
  }
}
