import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user";
import dbConfig from "./config";

let sequelize: Sequelize | null = null;

export function getSequelize() {
  if (!sequelize) {
    throw new Error("Sequelize is not loaded!");
  }
  return sequelize;
}

export function loadSequelize() {
  const models = [User];

  sequelize = new Sequelize({
    database: dbConfig.database,
    dialect: dbConfig.dialect,
    username: dbConfig.username,
    password: dbConfig.password,
    models,
    logging: false,
  });

  console.log("Loaded sequelize");
}
