import loadEnvConfig from "./util/loadEnvConfig";
import path from "path";

// IMPORTANT: This file must avoid importing logic else some code might run with the following variables being undefined
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
