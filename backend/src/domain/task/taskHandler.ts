import {
  TaskQueue,
  TaskQueueAction,
  TaskQueueName,
  TaskQueueSettings,
} from "./schemas";
import { Task, TaskStatus } from "../../db/models/task";
import { getSequelize } from "../../db/connection";
import { Transaction } from "sequelize";
import db from "../../db";
import dayjs from "dayjs";

export async function taskHandler({ name, action, settings }: TaskQueue) {
  if (settings.isRunning === true) {
    return;
  }
  settings.isRunning = true;

  const pendingTasks = await getPendingTasks(name, [TaskStatus.PENDING]);
  if (pendingTasks.length === 0) {
    settings.isRunning = false;
    return;
  }

  // TODO: Run tasks in parallel with concurrency limit

  for (const task of pendingTasks) {
    const transaction = await getTransaction(task.id);
    if (!transaction) {
      continue;
    }
    try {
      await handleTask(task, action, transaction);
    } catch (err) {
      console.error(`Task(${name}) error`, err);
      handleFailedTask(task, settings, transaction);
    }
  }

  settings.isRunning = false;
}

async function getPendingTasks(name: TaskQueueName, status: TaskStatus[]) {
  try {
    return await db.getTasksForQueue(name, status);
  } catch (err) {
    console.error(`Failed to get pending tasks for "${name}" queue`, err);
    return [];
  }
}

async function getTransaction(taskId: number) {
  try {
    return await getSequelize().transaction();
  } catch (err) {
    console.error(`Failed to get transaction for task ${taskId}`, err);
    return null;
  }
}

async function handleTask(
  task: Task,
  taskAction: TaskQueueAction,
  transaction: Transaction
) {
  if (task.nextRetryAt) {
    if (dayjs(task.nextRetryAt).isAfter()) {
      return;
    }
    task.nextRetryAt = null;
  }

  task.status = TaskStatus.PROCESSING;
  task.processingAt = new Date();
  await task.save();

  await taskAction(task.taskData, transaction);

  task.completedAt = new Date();
  task.status = TaskStatus.COMPLETED;
  await task.save({ transaction });

  await transaction.commit();
}

async function handleFailedTask(
  task: Task,
  settings: TaskQueueSettings,
  transaction: Transaction
) {
  try {
    await transaction.rollback();
  } catch (rollbackError) {
    console.error(`Failed to rollback transaction`, rollbackError);
  }

  task.failures = task.failures + 1;

  if (task.failures >= settings.maxFailures) {
    task.status = TaskStatus.TERMINATED;
    task.terminatedAt = new Date();
  } else {
    task.status = TaskStatus.PENDING;
    task.nextRetryAt = dayjs()
      .add(settings.retryCooldownSeconds, "seconds")
      .toDate();
  }

  try {
    await task.save();
  } catch (saveTaskError) {
    console.error(`Failed to update failed task: ${task.id}`, saveTaskError);
  }
}
