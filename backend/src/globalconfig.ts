import { Route, RouteMethod } from "./domain/router/schemas";
import loadEnvConfig from "./util/loadEnvConfig";
import * as user from "./domain/user";

loadEnvConfig();

/**
 * Server
 */
export const isDev = () => process.env.NODE_ENV === "development";
export const isProd = () => process.env.NODE_ENV === "production";
export const serverPort = process.env.PORT || 3000;

/**
 * Database
 */
export const databaseName = process.env.DB_NAME || "";
export const databaseUser = process.env.DB_USER || "";
export const databasePassword = process.env.DB_PASSWORD || "";

/**
 * Discord
 */
export const discordLoggerEnabled =
  process.env.DISCORD_LOGGER_ENABLED === "true";
export const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID || "";
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN || "";

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
