import { RequestHandler, Router } from 'express';
import { UUIDTypes, validate } from 'uuid';
import { CreateTaskResponse, Task, TaskParam, TaskSearchParam } from '../models/task';
import { BadRequestError } from '../db/error/operationErrors';
import {
  createTask,
  deleteTaskById,
  fetchTaskById,
  fetchTasks,
  searchTasks,
  updateTask,
} from '../services/taskService';

export const taskRouter = Router();

const isUuid = (value: string): boolean => validate(value);
const getTaskHandler: RequestHandler<TaskParam, Task> = (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new BadRequestError('Missing task id.');
    }
    if (!isUuid(id)) {
      throw new BadRequestError('Invalid task id.');
    }

    const task = fetchTaskById(id);

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
};

const getTasksHandler: RequestHandler<unknown, Task[]> = (_req, res, next) => {
  try {
    const result = fetchTasks();
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const createTaskHandler: RequestHandler<Task, CreateTaskResponse> = (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      throw new BadRequestError('Missing title.');
    }

    const id = createTask(title, description);
    const response = {
      id: id,
    };

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const deleteTaskHandler: RequestHandler<TaskParam, UUIDTypes> = (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new BadRequestError('Missing task id.');
    }
    if (!isUuid(id)) {
      throw new BadRequestError('Invalid task id.');
    }

    const result = deleteTaskById(id);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const searchTaskHandler: RequestHandler<TaskSearchParam, Task[]> = (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      throw new BadRequestError('Missing search content.');
    }
    const result = searchTasks(content);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const editTaskHandler: RequestHandler<TaskParam, Task> = (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new BadRequestError('Missing task id.');
    }
    if (!isUuid(id)) {
      throw new BadRequestError('Invalid task id.');
    }

    const { title, description, completed } = req.body;

    const result = updateTask(id, {
      title,
      description,
      completed,
    });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

taskRouter.post('/task', createTaskHandler);
taskRouter.patch('/task/:id', editTaskHandler);
taskRouter.get('/task/:id', getTaskHandler);
taskRouter.get('/tasks', getTasksHandler);
taskRouter.post('/tasks/search', searchTaskHandler);
taskRouter.delete('/task/:id', deleteTaskHandler);
