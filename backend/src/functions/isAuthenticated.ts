import { Request, Response } from "express";

export function handler(req: Request, res: Response) {
  res.send(`True`);
  return;
}
