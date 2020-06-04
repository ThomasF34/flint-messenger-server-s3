import { Request, Response, NextFunction } from 'express';

export function authenticationRequired(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) return next();
  res.status(401).send();
}
