import { _jwtSecret } from "../../globalconfig";
import * as jwt from "jsonwebtoken";

interface UserPayload {
  username: string;
}

export function generateToken(user: UserPayload) {
  const secret = _jwtSecret;
  if (!secret) {
    throw new Error("Failed to find secret for Passport!");
  }

  const payload = {
    username: user.username,
  };

  return jwt.sign(payload, secret, {
    expiresIn: "1h",
  });
}
