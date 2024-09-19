import { User } from "../../models/user";

async function createUser(user: { username: string; passwordHash: string }) {
  return await User.create({
    username: user.username,
    passwordHash: user.passwordHash,
  });
}

async function getUser(username: string) {
  return await User.findOne({ where: { username: username } });
}

export default {
  createUser,
  getUser,
};
