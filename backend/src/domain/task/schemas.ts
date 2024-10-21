import { Transaction } from "sequelize";

export type TaskQueue = {
  name: TaskQueueName;
  action: TaskQueueAction;
  settings: TaskQueueSettings;
};

export enum TaskQueueName {
  SAVE_IMAGES = "save-images",
}

export type TaskQueueData = {
  [TaskQueueName.SAVE_IMAGES]: {
    imageUrl: string;
  };
};

export type TaskQueueAction =
  | ((data: object) => Promise<void>)
  | ((data: object, transaction: Transaction) => Promise<void>);

export type TaskQueueSettings = {
  isRunning: boolean;
  concurrency: number | null;
  maxFailures: number;
  retryCooldownSeconds: number;
};
