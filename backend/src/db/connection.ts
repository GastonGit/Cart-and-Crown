import { Sequelize } from "sequelize-typescript";
import { Image } from "./models/image";
import { User } from "./models/user";
import { Task } from "./models/task";
import dbConfig from "./config";

let sequelize: Sequelize | null = null;

export function getSequelize() {
  if (!sequelize) {
    throw new Error("Sequelize is not loaded!");
  }
  return sequelize;
}

export function loadSequelize() {
  const models = [User, Task, Image];

  sequelize = new Sequelize({
    database: dbConfig.database,
    dialect: dbConfig.dialect,
    username: dbConfig.username,
    password: dbConfig.password,
    // Force Sequelize to interpret dates as UTC
    // (Make sure to set time_zone to UTC in MySQL as well "SET GLOBAL time_zone = '+00:00';")
    timezone: "+00:00",
    models,
    logging: false,
  });

  console.log("Loaded sequelize");
}
