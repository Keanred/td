import { RequestHandler, Router } from 'express';
import { UUID } from 'node:crypto';
import { validate } from 'uuid';
import { Task, TaskParam, TaskSearchParam } from '../models/task';
import { fetchTaskById } from '../services/taskService';

export const taskRouter = Router();

const isUuid = (value: string): value is UUID => validate(value);

const getTaskHandler: RequestHandler<TaskParam> = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send();
  }
  if (!isUuid(id)) {
    return res.status(400).send();
  }

  const task = fetchTaskById(id);

  if (!task) {
    res.status(204);
  }

  return res.json(task).status(200).send();
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

const searchTaskHandler: RequestHandler<TaskSearchParam> = (req, res) => {
  return res.status(200).send();
};

taskRouter.get('/task/:id', getTaskHandler);
taskRouter.get('/tasks', searchTaskHandler);
taskRouter.get('/tasks', getTasksHandler);
taskRouter.post('/task', createTaskHandler);
taskRouter.delete('/task/:id', deleteTaskHandler);
