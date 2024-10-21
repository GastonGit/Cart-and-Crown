import { TaskQueueData, TaskQueueName } from "./schemas";
import saveImages from "./queues/saveImages";
import { taskHandler } from "./taskHandler";
import db from "../../db";

export async function createTask<T extends TaskQueueName>(
  queueName: T,
  data: TaskQueueData[T]
) {
  const task = await db.createTask({
    taskQueueName: queueName,
    taskData: data,
  });
  console.log(`Created new task with id: ${task.id}`);
}

export async function pingTaskQueues() {
  console.log("Pinging task queues...");
  for (const taskQueue of taskQueues) {
    console.log(`Ping -> ${taskQueue.name}`);
    taskHandler(taskQueue);
  }
  console.log("Task queue pinging completed");
}

const taskQueues = [saveImages];
