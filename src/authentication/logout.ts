import { Request, Response } from 'express';

export async function logout(req: Request, res: Response): Promise<void> {
  req.logout();
  res.send();
}
