import {
  discordLoggerEnabled,
  pathToImageFolder,
  serverPort,
} from "./globalconfig";
import { logErrorToDiscord, startDiscordLogger } from "./util/discordLogger";
import express, { NextFunction, Request, Response, json } from "express";
import { loadRouter, getRouter } from "./domain/router";
import { loadPassport } from "./domain/passport";
import * as swaggerUi from "swagger-ui-express";
import openApiDocument from "./domain/api-docs";
import { loadSequelize } from "./db/connection";
import morgan from "morgan";

loadPassport();
loadRouter();
loadSequelize();

const PORT = serverPort;
const app = express();

/**
 * Applications
 */
app.use(morgan("tiny"));
app.use(json());

/**
 * Routes
 */
app.use("/api", getRouter());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use("/images", express.static(pathToImageFolder));

// Handle invalid paths
app.use(/(.*)/, (req, res, next: NextFunction) => {
  res.status(404);
  next(new Error());
});

/**
 * Error handling
 */
app.use(
  async (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    // Invalid path request
    if (res.statusCode === 404) {
      res.sendStatus(404);
      return;
    }

    if (res.statusCode === 400) {
      res.send(err.message);
      return;
    }

    console.error(err.stack);
    if (discordLoggerEnabled) {
      await logErrorToDiscord(err);
    }

    res.sendStatus(500);
  }
);
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

/**
 * Connect to the Discord bot and start the server
 */
const startApp = async () => {
  if (discordLoggerEnabled) {
    await startDiscordLogger();
  }
  app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
startApp();
