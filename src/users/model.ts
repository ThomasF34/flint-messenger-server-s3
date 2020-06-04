import { model, Schema, Document, Model } from 'mongoose';
import { SHA256 } from 'crypto-js';

export interface IProfile extends Document {
  email: string;
  lastName: string;
  firstName: string;
  status: string;
  updatedAt: string;
  getSafeProfile(): ISafeProfile;
  setPassword(password: string): void;
  validatePassword(password: string): boolean;
}

export type IUser = Pick<IProfile, '_id' | 'lastName' | 'firstName' | 'status' | 'updatedAt'>;

export type ISafeProfile = IUser & Pick<IProfile, 'email'>;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, required: true, default: 'Offline' },
  updatedAt: { type: Date },
});

userSchema.methods.setPassword = function (password: string): void {
  this.password = SHA256(password).toString();
};

userSchema.methods.validatePassword = function (password: string): boolean {
  return this.password === SHA256(password).toString();
};

userSchema.methods.getSafeProfile = function (): ISafeProfile {
  const { _id, email, lastName, firstName, status, updatedAt } = this;
  return { _id, email, lastName, firstName, status, updatedAt };
};

export interface IProfileModel extends Model<IProfile> {
  listUsers(): Promise<IUser[]>;
}

userSchema.statics.listUsers = async function (): Promise<IUser[]> {
  const result = await User.find({}, '_id lastName firstName status updatedAt').lean();
  return result;
};

userSchema.pre('save', function () {
  this.set({ updatedAt: new Date() });
});

export const User = model<IProfile, IProfileModel>('User', userSchema);
