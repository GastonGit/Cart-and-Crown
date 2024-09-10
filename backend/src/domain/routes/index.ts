import errorHandler from "../../util/errorHandler";
import { routes } from "../../globalconfig";
import { Route } from "./schemas";
import { Router } from "express";
import passport from "passport";

const router = Router();

export function makeRoute(route: Route) {
  switch (route.method) {
    case "GET":
      router.get(route.path, errorHandler(route.handler));
      break;
    case "POST":
      if (route.requiresAuth) {
        router.post(
          route.path,
          passport.authenticate("jwt", { session: false }),
          errorHandler(route.handler)
        );
      } else {
        router.post(route.path, errorHandler(route.handler));
      }
      break;
    default:
      throw new Error(`Invalid method "${route.method}"`);
  }
}

for (const route of routes) {
  makeRoute(route);
}

export default router;
