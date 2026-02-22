import { UUID } from 'node:crypto';
import { UUIDTypes, v4 as uuidV4 } from 'uuid';
import { deleteTask, editTask, getTask, getTaskByDescription, getTaskByTitle, getTasks, insertTask } from '../db/tasks';
import { db } from '../main';
import { Task } from '../models/task';

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
  getTaskByDescription(db, content);
  getTaskByTitle();
  return task;
};

export const updateTask = (): Task => {
  editTask(db, id, update);
  return task;
};

export const deleteTaskById = (id: UUIDTypes) => {
  deleteTask(db, id);
  return task;
};

export const createTask = (title: string, description: string = ''): UUID => {
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
