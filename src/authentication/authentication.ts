import { Handler } from 'express';
import joi from '@hapi/joi';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../users/model';

const schema = joi.object({
  username: joi
    .string()
    .pattern(/^[a-z0-9-.]+@[a-z0-9-.]+\.[a-z]+$/i)
    .required(),
  password: joi.string().max(20),
});

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const { error } = schema.validate({ username, password });
      if (error) return done(null, false);
      const user = await User.findOne({ email: username });
      if (!user) return done(null, false);
      const isValid = user.validatePassword(password);
      if (!isValid) return done(null, false);
      return done(null, user._id);
    } catch (error) {
      done(error);
    }
  }),
);

passport.serializeUser(({ _id }: { _id: string }, done) => {
  done(null, _id);
});

passport.deserializeUser(async (_id, done) => {
  done(undefined, { _id });
});

export const authenticationInitialize = (): Handler => passport.initialize();

export const authenticationSession = (): Handler => passport.session();
