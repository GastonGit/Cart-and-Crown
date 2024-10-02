import { userLoginRequestSchema, userSignupRequestSchema } from "./schemas";
import { getZodErrorMessages } from "../../util/getZodErrorMessages";
import { securePassword, verifyPassword } from "./securePassword";
import { generateToken } from "./authentication";
import { Request, Response } from "express";
import { ZodSchema } from "zod";
import db from "../../db";

export async function signup(req: Request, res: Response) {
  const { username, password } = parseBody(
    req,
    res,
    userSignupRequestSchema,
    "Invalid username or password"
  );

  const user = await db.getUser(username);
  if (user) {
    console.log(`Received duplicate signup request for user "${username}"`);
    res.status(422).send("Username is taken");
    return;
  }

  const passwordHash = await securePassword(password);

  console.log(`Creating new user "${username}"`);
  await db.createUser({ username, passwordHash });

  res.sendStatus(201);
  return;
}

export async function login(req: Request, res: Response) {
  const { username, password } = parseBody(
    req,
    res,
    userLoginRequestSchema,
    "Incorrect username or password"
  );

  const user = await db.getUser(username);
  if (!user) {
    res.status(400).send("User doesn't exist");
    return;
  }

  const matchingPassword = await verifyPassword(password, user.passwordHash);
  if (!matchingPassword) {
    res.status(400).send("Incorrect password");
    return;
  }

  const token = generateToken({ username });

  res.json({ token });
  return;
}

function parseBody<T>(
  req: Request,
  res: Response,
  schema: ZodSchema<T>,
  defaultMessage: string
): T {
  const parsedBody = schema.safeParse(req.body);
  if (parsedBody.success) {
    return parsedBody.data;
  }

  const messages = getZodErrorMessages(parsedBody.error);
  if (!messages) {
    console.log(`No error message for parsedBody: ${parsedBody}`);
  }
  res.status(400);
  throw new Error(messages || defaultMessage);
}

export function isAuthenticated(req: Request, res: Response) {
  res.send(`True`);
  return;
}
