import { Router, Request, Response } from "express";
import passport from "./passport";

import errorHandler from "./util/errorHandler";
import * as user from "./domain/user";

const router = Router();

function route(
  path: string,
  type: "GET" | "POST",
  handler: (req: Request, res: Response) => void,
  auth = false
) {
  if (!pathIsVersioned(path)) {
    throw new Error(`Path "${path}" is missing version or path`);
  }

  switch (type) {
    case "GET":
      router.get(path, errorHandler(handler));
      break;
    case "POST":
      if (auth) {
        router.post(
          path,
          passport.authenticate("jwt", { session: false }),
          errorHandler(handler)
        );
      } else {
        router.post(path, errorHandler(handler));
      }
      break;
    default:
      throw new Error(`Invalid route path "${type}"`);
  }
}

// TODO: Add test
function pathIsVersioned(path: string): boolean {
  const versionRegex = /^\/v\d+\/.+/; // /v1/something
  return versionRegex.test(path);
}

route("/v1/login", "POST", user.login);
route("/v1/isAuthenticated", "POST", user.isAuthenticated, true);

export default router;
