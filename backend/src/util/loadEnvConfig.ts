import * as dotenv from "dotenv";

export default function loadEnvConfig() {
  if (process?.env?.NODE_ENV) {
    console.log(`Environment variables are already loaded, skipping`);
    return;
  }

  dotenv.config();
  dotenv.config({ path: `.env.${process.env.APP_ENV}` });
  console.log(`Using ${process.env.APP_ENV} environment variables`);
}
