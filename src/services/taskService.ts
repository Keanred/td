import { UUIDTypes, v4 as uuidV4 } from 'uuid';
import { deleteTask, editTask, getTask, getTaskByDescription, getTaskByTitle, getTasks, insertTask } from '../db/tasks';
import { db } from '../main';
import { OperationResult } from '../models/result';
import { EditTaskParams, Task } from '../models/task';

export const fetchTaskById = (id: UUIDTypes): Task => {
  const stringId = id.toString();
  const result = getTask(db, stringId);
  return result;
};

export const fetchTasks = (): Task[] => {
  const result = getTasks(db);
  console.log(result);
  return result;
};

export const searchTasks = (content: string): Task[] => {
  let result = getTaskByDescription(db, content);
  if (result.length === 0) {
    result = getTaskByTitle(db, content);
  }
  return result;
};

export const updateTask = (id: UUIDTypes, update: EditTaskParams): Task | OperationResult => {
  const stringId = id.toString();
  const fetchResult = getTask(db, stringId);
  if (fetchResult === OperationResult.NOT_FOUND) {
    return OperationResult.NOT_FOUND;
  }

  const { title, description, completed, createdAt } = fetchResult;
  const updatedTask = {
    title: update.title ?? title,
    description: update.description ?? description,
    completed: update.completed ?? completed,
    createdAt: new Date(createdAt),
  };
  let result = editTask(db, stringId, updatedTask);
  return result;
};

export const deleteTaskById = (id: UUIDTypes) => {
  const stringId = id.toString();
  const result = deleteTask(db, stringId);
  if (result.changes && result.changes > 0) {
    return OperationResult.OK;
  }
  return OperationResult.FAIL;
};

export const createTask = (title: string, description: string = ''): UUIDTypes => {
  const task: Task = {
    id: uuidV4(),
    title,
    description,
    completed: false,
    createdAt: new Date(),
  };
  const taskId = insertTask(db, task);
  return taskId;
};
