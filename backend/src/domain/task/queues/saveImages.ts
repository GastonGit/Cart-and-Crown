import { TaskQueueName, TaskQueueSettings } from "../schemas";
import { Transaction } from "sequelize";
import db from "../../../db";
import { z } from "zod";

const settings: TaskQueueSettings = {
  isRunning: false,
  concurrency: 0,
  maxFailures: 3,
  retryCooldownSeconds: 10,
};

const taskDataSchema = z.object({ imageUrl: z.string() });

async function action(data: object, transaction: Transaction) {
  const parsedData = taskDataSchema.parse(data);
  await db.createImage(parsedData.imageUrl, transaction);
}

export default { name: TaskQueueName.SAVE_IMAGES, settings, action };
