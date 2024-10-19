import * as gc from "../globalconfig";
import { Dialect } from "sequelize";

interface IDBConfig {
  username: string;
  password: string;
  database: string;
  dialect: Dialect;
}

const dbConfig: IDBConfig = {
  database: gc.databaseName,
  username: gc.databaseUser,
  password: gc.databasePassword,
  dialect: "mysql" as Dialect,
};

export default dbConfig;
module.exports = dbConfig; // Required for sequelize-cli to find the config in the transpiled version
