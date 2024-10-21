import {
  TaskQueueSettings,
  TaskQueueName,
} from "../../../src/domain/task/schemas";
import { taskHandler } from "../../../src/domain/task/taskHandler";
import { TaskStatus, Task } from "../../../src/db/models/task";
import db from "../../../src/db";
import dayjs from "dayjs";

const getTasksSpy = jest.spyOn(db, "getTasksForQueue");
const date = new Date("2024-10-21T14:00:00Z");

const commit = jest.fn();
const rollback = jest.fn();
jest.mock("../../../src/db/connection", () => ({
  getSequelize: () => ({
    transaction: async () => ({
      commit,
      rollback,
    }),
  }),
}));

jest.useFakeTimers().setSystemTime(new Date(date.toISOString()));

describe("taskHandler", () => {
  it("should not run if already running", async () => {
    const settings = {
      isRunning: true,
    } as unknown as TaskQueueSettings;
    const action = jest.fn();
    await taskHandler({
      name: TaskQueueName.SAVE_IMAGES,
      action,
      settings,
    });
    expect(action).toHaveBeenCalledTimes(0);
    expect(settings.isRunning).toBe(true);
  });

  it("should run action if tasks exist", async () => {
    const task = {
      id: 1,
      taskData: { test: true },
      status: TaskStatus.PENDING,
      completedAt: null as unknown as Date,
      save: jest.fn(),
    } as unknown as Task;
    getTasksSpy.mockImplementation(async (_name, status) =>
      status?.includes(TaskStatus.PENDING) ? ([task] as unknown as Task[]) : []
    );
    const statusSetter = jest.fn();
    Object.defineProperty(task, "status", {
      set: statusSetter,
      get: () =>
        statusSetter.mock.calls[statusSetter.mock.calls.length - 1]?.[0] ||
        TaskStatus.PENDING,
    });

    const settings: TaskQueueSettings = {
      isRunning: false,
    } as unknown as TaskQueueSettings;
    const action = jest.fn();

    await taskHandler({ name: TaskQueueName.SAVE_IMAGES, action, settings });

    expect(action).toHaveBeenCalledWith(task.taskData, expect.anything());
    expect(commit).toHaveBeenCalled();
    expect(settings.isRunning).toBe(false);
    expect(statusSetter).toHaveBeenNthCalledWith(1, TaskStatus.PROCESSING);
    expect(statusSetter).toHaveBeenNthCalledWith(2, TaskStatus.COMPLETED);
    expect(task.status).toBe(TaskStatus.COMPLETED);
    expect(task.processingAt?.toISOString()).toBe(date.toISOString());
    expect(task.completedAt?.toISOString()).toBe(date.toISOString());
    expect(task.save).toHaveBeenCalled();
  });

  it("should set up failed tasks for retry", async () => {
    const task = {
      id: 1,
      taskData: { test: true },
      failures: 0,
      status: null,
      completedAt: null as unknown as Date,
      nextRetryAt: null as unknown as Date,
      save: jest.fn(),
    } as unknown as Task;
    getTasksSpy.mockImplementation(async (_name, status) =>
      status?.includes(TaskStatus.PENDING) ? ([task] as unknown as Task[]) : []
    );

    const settings: TaskQueueSettings = {
      isRunning: false,
    } as unknown as TaskQueueSettings;
    const action = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    await taskHandler({ name: TaskQueueName.SAVE_IMAGES, action, settings });

    expect(action).toHaveBeenCalledWith(task.taskData, expect.anything());
    expect(rollback).toHaveBeenCalled();
    expect(settings.isRunning).toBe(false);
    expect(task.status).toBe(TaskStatus.PENDING);
    expect(task.failures).toBe(1);
    expect(task.completedAt).toBe(null);
    expect(task.nextRetryAt).toBeInstanceOf(Date);
    expect(task.save).toHaveBeenCalled();
  });

  it("should retry failed tasks", async () => {
    const task = {
      id: 1,
      taskData: { test: true },
      status: TaskStatus.PENDING,
      completedAt: null as unknown as Date,
      nextRetryAt: dayjs(date).subtract(5, "minutes").toDate(),
      save: jest.fn(),
    } as unknown as Task;
    getTasksSpy.mockImplementation(async (_name, status) =>
      status?.includes(TaskStatus.PENDING) ? ([task] as unknown as Task[]) : []
    );

    const settings: TaskQueueSettings = {
      isRunning: false,
    } as unknown as TaskQueueSettings;
    const action = jest.fn();

    await taskHandler({ name: TaskQueueName.SAVE_IMAGES, action, settings });

    expect(action).toHaveBeenCalledWith(task.taskData, expect.anything());
    expect(commit).toHaveBeenCalled();
    expect(settings.isRunning).toBe(false);
    expect(task.status).toBe(TaskStatus.COMPLETED);
    expect(task.completedAt?.toISOString()).toBe(date.toISOString());
    expect(task.save).toHaveBeenCalled();
  });

  it("should not retry tasks before set time", async () => {
    const task = {
      status: TaskStatus.PENDING,
      nextRetryAt: dayjs(date).add(5, "minutes").toDate(),
    } as unknown as Task;
    getTasksSpy.mockImplementation(async (_name, status) =>
      status?.includes(TaskStatus.PENDING) ? ([task] as unknown as Task[]) : []
    );

    const settings: TaskQueueSettings = {
      isRunning: false,
    } as unknown as TaskQueueSettings;
    const action = jest.fn();

    await taskHandler({ name: TaskQueueName.SAVE_IMAGES, action, settings });

    expect(action).toHaveBeenCalledTimes(0);
  });

  it("should terminate tasks that fails too many times", async () => {
    const task = {
      id: 1,
      taskData: { test: true },
      failures: 2,
      status: TaskStatus.PENDING,
      completedAt: null,
      nextRetryAt: dayjs(date).subtract(5, "minutes").toDate(),
      save: jest.fn(),
    } as unknown as Task;
    getTasksSpy.mockImplementation(async (_name, status) =>
      status?.includes(TaskStatus.PENDING) ? ([task] as unknown as Task[]) : []
    );

    const settings: TaskQueueSettings = {
      isRunning: false,
      maxFailures: 3,
    } as unknown as TaskQueueSettings;
    const action = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    await taskHandler({ name: TaskQueueName.SAVE_IMAGES, action, settings });

    expect(action).toHaveBeenCalledWith(task.taskData, expect.anything());
    expect(rollback).toHaveBeenCalled();
    expect(settings.isRunning).toBe(false);
    expect(task.status).toBe(TaskStatus.TERMINATED);
    expect(task.failures).toBe(3);
    expect(task.completedAt).toBe(null);
    expect(task.nextRetryAt).toBe(null);
    expect(task.processingAt?.toISOString()).toBe(date.toISOString());
    expect(task.terminatedAt).toBeInstanceOf(Date);
    expect(task.save).toHaveBeenCalled();
  });
});
