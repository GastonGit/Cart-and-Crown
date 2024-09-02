import * as jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  username: string;
}

export const generateToken = (user: UserPayload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Failed to find secret for Passport!");
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  return jwt.sign(payload, secret, {
    expiresIn: "1h",
  });
};
