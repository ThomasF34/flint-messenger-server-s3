import { model, Schema } from 'mongoose';

const messageSchema = new Schema({
  conversationId: { type: String, required: true },
  emitter: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  target: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date },
});

messageSchema.pre('save', function () {
  this.set({ createdAt: new Date() });
});

export const Message = model('Message', messageSchema);
