import loadEnvConfig from "../util/loadEnvConfig";
import { Dialect } from "sequelize";

loadEnvConfig();

interface IDBConfig {
  username: string;
  password: string;
  database: string;
  dialect: Dialect;
}

const dbConfig: IDBConfig = {
  username: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
  dialect: "mysql" as Dialect,
};

export default dbConfig;
module.exports = dbConfig; // Required for sequelize-cli to find the config in the transpiled version
