import { Handler } from 'express';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../users/model';

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username });
      if (user) {
        const isValid = user.validatePassword(password);
        if (isValid) return done(null, user.getSafeProfile());
      }
      return done(null, false);
    } catch (error) {
      done(error);
    }
  }),
);

passport.serializeUser(({ _id }: { _id: string }, done) => {
  done(null, _id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findOne({ _id }, '_id');
    done(undefined, user && user.getSafeProfile());
  } catch (error) {
    done(error);
  }
});

export const authenticationInitialize = (): Handler => passport.initialize();

export const authenticationSession = (): Handler => passport.session();
