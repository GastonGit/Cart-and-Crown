import passport from "./passport";
import { Router } from "express";

import * as isAuthenticated from "./functions/isAuthenticated";
import * as login from "./functions/login";

const router = Router();

router.post("/login", login.handler);
router.post(
  "/isAuthenticated",
  passport.authenticate("jwt", { session: false }),
  isAuthenticated.handler
);

export default router;
