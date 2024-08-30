import { generateToken } from "../util/auth";
import { Request, Response } from "express";

export function handler(req: Request, res: Response) {
  const { username, password } = req.body;

  // TODO: Authenticate user
  if (username != "test") {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const user = { id: "1", username: "test" };

  const token = generateToken({ id: user.id, username: user.username });

  res.json({ token });
}
