import { Route, RouteMethod } from "./domain/routes/schemas";
import * as user from "./domain/user";

export const isDev = () => process.env.NODE_ENV === "development";
export const isProd = () => process.env.NODE_ENV === "production";

/**
 * Routes
 */
export const routeLogin = {
  path: "/v1/login",
  method: RouteMethod.POST,
  handler: user.login,
  requiresAuth: false,
};
export const routeIsAuthenticated = {
  path: "/v1/isAuthenticated",
  method: RouteMethod.POST,
  handler: user.isAuthenticated,
  requiresAuth: true,
};
export const routes: Route[] = [routeLogin, routeIsAuthenticated];
