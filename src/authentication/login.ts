import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User } from '../users';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  await passport.authenticate('local', function (err, reqUser) {
    if (err) return next(err);
    if (!reqUser) return res.status(401).send();
    console.log(`Req user: ${reqUser}`);
    req.logIn(reqUser, async (err) => {
      if (err) return next(err);
      const user = await User.findById(reqUser);
      if (!user) throw Error('User not found');
      res.json(user.getSafeProfile());
    });
  })(req, res, next);
}
