import { model, Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: string;
  emitter: string;
  targets: string[];
  content: string;
  createdAt: string;
}

const messageSchema = new Schema({
  conversationId: { type: String, required: true },
  emitter: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  targets: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date },
});

messageSchema.pre('save', function () {
  this.set({ createdAt: new Date() });
});

export const Message = model<IMessage>('Message', messageSchema);
