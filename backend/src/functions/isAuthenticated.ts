import { Request, Response } from "express";

export const handler = (req: Request, res: Response) => {
  res.send(`True`);
};
