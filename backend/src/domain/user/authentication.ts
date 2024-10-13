import { _jwtSecret } from "../../globalconfig";
import * as jwt from "jsonwebtoken";

export function generateToken(payload: { username: string }) {
  const secret = getSecret();
  return jwt.sign(payload, secret, {
    expiresIn: "1h",
  });
}

export function isValidToken(token: string) {
  const secret = getSecret();
  try {
    jwt.verify(token, secret);
    return true;
  } catch (_err) {
    return false;
  }
}

function getSecret() {
  const secret = _jwtSecret;
  if (!secret) {
    throw new Error("Failed to find secret for jwt secret!");
  }
  return secret;
}
