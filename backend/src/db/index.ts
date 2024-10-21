import * as image from "./queries/image";
import * as user from "./queries/user";
import * as task from "./queries/task";

export default {
  ...user.default,
  ...task.default,
  ...image.default,
};
