import { UUIDTypes, v4 as uuidV4 } from 'uuid';
import { NotFoundError } from '../db/error/operationErrors';
import { deleteTask, editTask, getTask, getTasks, insertTask, searchTaskByContent } from '../db/tasks';
import { db } from '../main';
import { OperationResult } from '../models/result';
import { EditTaskParams, Task } from '../models/task';

export const fetchTaskById = (id: UUIDTypes): Task => {
  const stringId = id.toString();
  const [result, operationResult] = getTask(db, stringId);
  if (operationResult === OperationResult.NOT_FOUND || !result) {
    throw new NotFoundError('Task not found.');
  }
  return result;
};

export const fetchTasks = (): Task[] => {
  const [fetchResult, operationResult] = getTasks(db);
  if (operationResult === OperationResult.NOT_FOUND || !fetchResult) {
    throw new NotFoundError('Tasks not found.');
  }
  return fetchResult;
};

export const searchTasks = (content: string): Task[] => {
  const [searchResult, operationResult] = searchTaskByContent(db, content);
  if (operationResult === OperationResult.NOT_FOUND || !searchResult) {
    throw new NotFoundError('No tasks found for the search content.');
  }
  return searchResult;
};

// eslint-disable-next-line complexity
export const updateTask = (id: UUIDTypes, update: EditTaskParams): Task => {
  const stringId = id.toString();
  const [updateResult, operationResult] = getTask(db, stringId);
  if (operationResult === OperationResult.NOT_FOUND || !updateResult) {
    throw new NotFoundError('Task not found.');
  }

  const { title, description, completed, createdAt } = updateResult;
  const updatedTask = {
    title: update.title ?? title,
    description: update.description ?? description,
    completed: update.completed ?? completed,
    createdAt: new Date(createdAt),
  };
  let [editedTask, editResult] = editTask(db, stringId, updatedTask);
  if (editResult === OperationResult.NOT_FOUND || !editedTask) {
    throw new NotFoundError('Task not found.');
  }
  return editedTask;
};

export const deleteTaskById = (id: UUIDTypes): UUIDTypes => {
  const stringId = id.toString();
  const [taskId, result] = deleteTask(db, stringId);
  if (result === OperationResult.NOT_FOUND || !taskId) {
    throw new NotFoundError('Task not found.');
  }
  return taskId;
};

export const createTask = (title: string, description: string = ''): UUIDTypes => {
  const task: Task = {
    id: uuidV4(),
    title,
    description,
    completed: false,
    createdAt: new Date(),
  };
  const [insertResult, operationResult] = insertTask(db, task);
  if (operationResult === OperationResult.NOT_FOUND || !insertResult) {
    throw new NotFoundError('Task store not found.');
  }
  return insertResult;
};
