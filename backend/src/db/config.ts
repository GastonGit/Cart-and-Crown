import { databaseName, databasePassword, databaseUser } from "../globalconfig";
import { Dialect } from "sequelize";

interface IDBConfig {
  username: string;
  password: string;
  database: string;
  dialect: Dialect;
}

const dbConfig: IDBConfig = {
  database: databaseName,
  username: databaseUser,
  password: databasePassword,
  dialect: "mysql" as Dialect,
};

export default dbConfig;
module.exports = dbConfig; // Required for sequelize-cli to find the config in the transpiled version
