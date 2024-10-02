import * as bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function securePassword(password: string) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
