import { Image } from "../models/image";
import { Transaction } from "sequelize";

async function createImage(filename: string, transaction?: Transaction) {
  return await Image.create({ filename }, { transaction });
}

export default {
  createImage,
};
