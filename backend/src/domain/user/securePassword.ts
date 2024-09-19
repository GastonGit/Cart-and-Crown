import * as bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function securePassword(password: string) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}
