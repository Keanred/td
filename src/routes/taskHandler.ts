import { RequestHandler, Router } from 'express';
import { Task, TaskParam, TaskSearchParam } from '../models/task';

export const taskRouter = Router();

const getTaskHandler: RequestHandler<TaskParam> = (req, res) => {
  return res.sendStatus(200);
};

const getTasksHandler: RequestHandler<never> = (req, res) => {
  return res.status(200).send();
};

const createTaskHandler: RequestHandler<Task> = (req, res) => {
  return res.status(200).send();
};

const deleteTaskHandler: RequestHandler<TaskParam> = (req, res) => {
  return res.status(200).send();
};

const searchTaskHandler: RequestHandler<never, unknown, unknown, TaskSearchParam> = (
  req,
  res,
  next,
) => {
  if (!req.query.content) {
    return next();
  }

  return res.status(200).send();
};
taskRouter.get('/task/:id', getTaskHandler);
taskRouter.get('/tasks', searchTaskHandler);
taskRouter.get('/tasks', getTasksHandler);
taskRouter.post('/task', createTaskHandler);
taskRouter.delete('/task/:id', deleteTaskHandler);
