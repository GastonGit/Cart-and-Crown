import errorHandler from "../../util/errorHandler";
import { getPassport } from "../passport";
import { Route } from "./schemas";
import { routes } from "./routes";
import { Router } from "express";

let router: Router | null = null;

export function getRouter() {
  if (!router) {
    throw new Error("Router is not loaded!");
  }
  return router;
}

export function loadRouter() {
  const _router = Router();

  function makeRoute(route: Route) {
    switch (route.method) {
      case "GET":
        _router.get(route.path, errorHandler(route.handler));
        break;
      case "POST":
        if (route.requiresAuth) {
          _router.post(
            route.path,
            getPassport().authenticate("jwt", { session: false }),
            errorHandler(route.handler)
          );
        } else {
          _router.post(route.path, errorHandler(route.handler));
        }
        break;
      default:
        throw new Error(`Invalid method "${route.method}"`);
    }
  }

  for (const route of routes) {
    makeRoute(route);
  }

  router = _router;
  console.log("Loaded router");
}
