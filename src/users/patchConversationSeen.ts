import { Request, Response, NextFunction } from 'express';
import joi from '@hapi/joi';
import { User } from './model';

const schema = joi.object({
  conversationId: joi.string().base64().required(),
  seenDate: joi.date().iso().required(),
});

export async function patchConversationSeen(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw Error('Anonymous request');
    const user = await User.findById((req.user as any)._id);
    if (!user) throw Error('User not found');
    const { conversationId, seenDate } = req.body;
    const { error } = schema.validate({ conversationId, seenDate });
    if (error) throw error;
    user.updateSeen(conversationId, seenDate);
    await user.save();
    res.json(user.getSafeProfile());
  } catch (error) {
    next(error);
  }
}
