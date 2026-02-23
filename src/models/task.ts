import { UUIDTypes } from 'uuid';

export type Task = {
  id: UUIDTypes;
  title: string;
  description?: string | undefined;
  completed: boolean;
  createdAt: Date;
};

export type TaskParam = {
  id: string;
};

export type TaskSearchParam = {
  content: string;
};

export type EditTaskParams = {
  title?: string;
  description?: string;
  completed?: boolean;
};

export type CreateTaskResponse = {
  id: UUIDTypes;
};

export type ErrorResponse = {
  error: string;
};

export type DatabaseTaskRow = {
  id: string;
  title: string;
  description: string | null;
  completed: 0 | 1;
  createdAt: string;
};

export type TaskUpdateParams = [string, string | undefined, number, string, string];
