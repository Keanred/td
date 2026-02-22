import { UUID } from 'node:crypto';
import { UUIDTypes, v4 as uuidV4 } from 'uuid';
import { editTask, getTask, getTaskByDescription, getTaskByTitle, getTasks, insertTask } from '../db/tasks';
import { db } from '../main';
import { Task } from '../models/task';

export const fetchTaskById = (id: UUIDTypes): Task => {
  getTask(db, id);
  return task;
};

export const fetchTasks = (): Task[] => {
  getTasks(db);
  return tasks;
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

export const deleteTask = (id: UUIDTypes) => {
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
