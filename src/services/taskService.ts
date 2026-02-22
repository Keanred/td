import { UUID } from 'node:crypto';
import { editTask, getTask, getTaskByDescription, getTaskByTitle, getTasks, insertTask } from '../db/tasks';
import { db } from '../main';
import { Task } from '../models/task';

export const fetchTaskById = (id: UUID): Task => {
  getTask(db, id);
  return task;
};

export const fetchTasks = (): Task[] => {
  getTasks(db);
  return tasks;
};

export const searchTask = (content: string): Task => {
  getTaskByDescription(db, content);
  getTaskByTitle();
  return task;
};

export const updateTask = (): Task => {
  editTask(db, id, update);
  return task;
};

export const deleteTask = (id: UUID) => {
  deleteTask(db, id);
  return task;
};

export const createTask = (task): UUID => {
  insertTask(db, task);
  return id;
};
