import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();
console.log(`Starting server for ${process.env.APP_ENV} environment`);
dotenv.config({ path: `.env.${process.env.APP_ENV}` });

import { discordClient, logErrorToDiscord } from "./util/logger";
import routes from "./routes";

const PORT = process.env.PORT || 3000;
const app = express();

/**
 * Applications
 */
app.use(morgan("tiny"));
app.use(express.json());
app.use("/api", routes);

/**
 * Error handling
 */
app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  await logErrorToDiscord(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});
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
discordClient.once("ready", () => {
  console.log(`Discord error logging ready`);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
