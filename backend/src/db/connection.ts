import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user";
import dbConfig from "./config"; // Import the single configuration

const models = [User];

const sequelize = new Sequelize({
  database: dbConfig.database,
  dialect: dbConfig.dialect,
  username: dbConfig.username,
  password: dbConfig.password,
  models,
  logging: false,
});

export default sequelize;
