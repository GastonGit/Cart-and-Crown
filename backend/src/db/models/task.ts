import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from "sequelize-typescript";
import { TaskQueueName } from "../../domain/task/schemas";

export enum TaskStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  TERMINATED = "terminated",
}

@Table({
  timestamps: true,
  tableName: "task",
})
export class Task extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.ENUM(...Object.values(TaskQueueName)),
    allowNull: false,
  })
  taskQueueName: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  taskData: object;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  failures: number;

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    allowNull: false,
    defaultValue: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  pendingAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  processingAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  nextRetryAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  terminatedAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completedAt: Date | null;
}
