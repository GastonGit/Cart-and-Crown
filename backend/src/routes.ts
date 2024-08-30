import passport from "./passport";
import { Router } from "express";

import * as isAuthenticated from "./functions/isAuthenticated";
import errorHandler from "./util/errorHandler";
import * as login from "./functions/login";

const router = Router();

function route(path: string, type: "GET" | "POST", handler: any, auth = false) {
  switch (type) {
    case "GET":
      router.get(path, errorHandler(handler));
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
  }
}

route("/login", "POST", login.handler);
route("/isAuthenticated", "POST", isAuthenticated.handler, true);

export default router;
