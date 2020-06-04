import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  await passport.authenticate('local', function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send();
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json(user.getSafeProfile());
    });
  })(req, res, next);
}
