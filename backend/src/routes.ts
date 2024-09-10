import { Router, Request, Response } from "express";
import errorHandler from "./util/errorHandler";
import { routes } from "./globalconfig";
import passport from "passport";
import { z } from "zod";

export enum RouteMethod {
  GET = "GET",
  POST = "POST",
}

const versionedPathSchema = z.string().regex(/^\/v\d+\/.+/, {
  message: "Path must start with '/v' followed by a number and a path",
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RouteSchema = z.object({
  path: versionedPathSchema,
  method: z.enum([RouteMethod.GET, RouteMethod.POST]),
  handler: z
    .function()
    .args(z.custom<Request>(), z.custom<Response>())
    .returns(z.void()),
  requiresAuth: z.boolean(),
});

export type Route = z.infer<typeof RouteSchema>;

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
