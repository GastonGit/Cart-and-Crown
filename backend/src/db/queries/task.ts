import { TaskQueueData, TaskQueueName } from "../../domain/task/schemas";
import { Task, TaskStatus } from "../models/task";

async function getTasksForQueue(
  taskQueueName: TaskQueueName,
  status?: TaskStatus[]
) {
  return await Task.findAll({
    where: {
      taskQueueName,
      ...(status && status.length > 0 && { status }),
    },
  });
}

async function createTask<T extends TaskQueueName>(task: {
  taskQueueName: T;
  taskData: TaskQueueData[T];
}) {
  return await Task.create({
    taskQueueName: task.taskQueueName,
    taskData: task.taskData,
    pendingAt: new Date(),
  });
}

export default {
  getTasksForQueue,
  createTask,
};
