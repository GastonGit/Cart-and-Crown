import { Request, Response } from "express";
import { z } from "zod";

export enum RouteMethod {
  GET = "GET",
  POST = "POST",
}

export const routeSchema = z.object({
  path: z.string().regex(/^\/v\d+\/.+/, {
    message: "Path must start with '/v' followed by a number and a path",
  }),
  method: z.enum([RouteMethod.GET, RouteMethod.POST]),
  handler: z
    .function()
    .args(z.custom<Request>(), z.custom<Response>())
    .returns(z.void()),
  requiresAuth: z.boolean(),
});
export type Route = z.infer<typeof routeSchema>;
