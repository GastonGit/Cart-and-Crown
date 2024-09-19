import { userLoginRequestSchema } from "./schemas";
import { securePassword } from "./securePassword";
import { generateToken } from "../../util/auth";
import { Request, Response } from "express";
import db from "../../db";

export function login(req: Request, res: Response) {
  const {
    username, //password
  } = req.body;

  // TODO: Authenticate user
  if (username != "test") {
    res.status(401).json({ message: "Invalid username or password" });
    return;
  }
  const user = { id: "1", username: "test" };

  const token = generateToken({ id: user.id, username: user.username });

  res.json({ token });
  return;
}

export async function signup(req: Request, res: Response) {
  const body = userLoginRequestSchema.parse(req.body);

  const username = body.username.toLowerCase();
  const user = await db.getUser(username);
  if (user) {
    console.log(`Received duplicate signup request for user "${username}"`);
    res.status(422).send("Username is taken");
    return;
  }

  const passwordHash = await securePassword(body.password);

  console.log(`Creating new user "${username}"`);
  await db.createUser({ username, passwordHash });

  res.sendStatus(200);
  return;
}

export function isAuthenticated(req: Request, res: Response) {
  res.send(`True`);
  return;
}
