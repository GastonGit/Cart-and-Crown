import { Route, RouteMethod } from "./domain/router/schemas";
import loadEnvConfig from "./util/loadEnvConfig";
import * as user from "./domain/user";
import files from "./domain/files";
import path from "path";

loadEnvConfig();

/**
 * Server
 */
export const isDev = () => process.env.NODE_ENV === "development";
export const isProd = () => process.env.NODE_ENV === "production";
export const serverPort = Number(process.env.PORT) || 3000;

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
 * User
 */
export const _jwtSecret = process.env.JWT_SECRET;

/**
 * Paths
 */
export const pathToImageFolder = path.join(__dirname, "public/images/");

/**
 * Routes
 */
export const routeUserSignup: Route = {
  path: "/v1/user/signup",
  method: RouteMethod.POST,
  handler: user.signup,
  requiresAuth: false,
};
export const routeUserLogin: Route = {
  path: "/v1/user/login",
  method: RouteMethod.POST,
  handler: user.login,
  requiresAuth: false,
};
export const routeUserStatus: Route = {
  path: "/v1/user/status",
  method: RouteMethod.POST,
  handler: user.status,
  requiresAuth: false,
};

export const routeFilesImageUpload: Route = {
  path: "/v1/files/image/upload",
  method: RouteMethod.POST,
  handler: files.uploadImage,
  requiresAuth: true,
};

export const routes: Route[] = [
  routeUserSignup,
  routeUserLogin,
  routeUserStatus,
  routeFilesImageUpload,
];
