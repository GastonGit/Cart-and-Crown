import express, { NextFunction, Request, Response, json } from "express";
import * as swaggerUi from "swagger-ui-express";
import * as dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();
console.log(`Starting server for ${process.env.APP_ENV} environment`);
dotenv.config({ path: `.env.${process.env.APP_ENV}` });

import { logErrorToDiscord, startDiscordLogger } from "./util/discordLogger";
import { discordLoggerEnabled } from "./globalconfig";
import openApiDocument from "./domain/api-docs";
import routes from "./domain/routes";

const PORT = process.env.PORT || 3000;
const app = express();

/**
 * Applications
 */
app.use(morgan("tiny"));
app.use(json());

/**
 * Routes
 */
app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

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
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
startApp();
