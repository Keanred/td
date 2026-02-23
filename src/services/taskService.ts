import { UUIDTypes, v4 as uuidV4 } from 'uuid';
import { deleteTask, editTask, getTask, getTasks, insertTask, searchTaskByContent } from '../db/tasks';
import { db } from '../main';
import { OperationResult } from '../models/result';
import { EditTaskParams, Task } from '../models/task';

export const fetchTaskById = (id: UUIDTypes): Task | undefined => {
  const stringId = id.toString();
  const [result, operationResult] = getTask(db, stringId);
  if (operationResult === OperationResult.NOT_FOUND || !result) {
    return undefined;
  }
  return result;
};

export const fetchTasks = (): Task[] | OperationResult.NOT_FOUND => {
  const [result, operationResult] = getTasks(db);
  if (operationResult === OperationResult.NOT_FOUND || !result) {
    return OperationResult.NOT_FOUND;
  }
  return result;
};

export const searchTasks = (content: string): Task[] | OperationResult.NOT_FOUND => {
  const [searchResult, operationResult] = searchTaskByContent(db, content);
  if (operationResult === OperationResult.NOT_FOUND || !searchResult) {
    return OperationResult.NOT_FOUND;
  }
  return searchResult;
};

// eslint-disable-next-line complexity
export const updateTask = (id: UUIDTypes, update: EditTaskParams): Task | OperationResult.NOT_FOUND => {
  const stringId = id.toString();
  const [task, fetchResult] = getTask(db, stringId);
  if (fetchResult === OperationResult.NOT_FOUND || !task) {
    return OperationResult.NOT_FOUND;
  }

  const { title, description, completed, createdAt } = task;
  const updatedTask = {
    title: update.title ?? title,
    description: update.description ?? description,
    completed: update.completed ?? completed,
    createdAt: new Date(createdAt),
  };
  let [editedTask, editResult] = editTask(db, stringId, updatedTask);
  if (editResult === OperationResult.NOT_FOUND || !editedTask) {
    return OperationResult.NOT_FOUND;
  }
  return editedTask;
};

export const deleteTaskById = (id: UUIDTypes) => {
  const stringId = id.toString();
  const result = deleteTask(db, stringId);
  if (result === OperationResult.NOT_FOUND) {
    return OperationResult.NOT_FOUND;
  }
  return OperationResult.OK;
};

export const createTask = (title: string, description: string = ''): UUIDTypes | OperationResult => {
  const task: Task = {
    id: uuidV4(),
    title,
    description,
    completed: false,
    createdAt: new Date(),
  };
  const [taskId, operationResult] = insertTask(db, task);
  if (operationResult === OperationResult.NOT_FOUND) {
    return OperationResult.NOT_FOUND;
  }
  return taskId;
};
