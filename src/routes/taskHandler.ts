import { RequestHandler, Router } from 'express';
import { validate } from 'uuid';
import { OperationResult } from '../models/result';
import { CreateTaskResponse, ErrorResponse, Task, TaskParam, TaskSearchParam } from '../models/task';
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

const getTaskHandler: RequestHandler<TaskParam, Task | ErrorResponse> = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: 'Missing task id.' }).send();
  }
  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid task id.' }).send();
  }

  const task = fetchTaskById(id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' }).send();
  }

  return res.json(task).status(200).send();
};

const getTasksHandler: RequestHandler<unknown, Task[] | ErrorResponse> = (_req, res) => {
  const tasks: Task[] = fetchTasks();
  return res.status(200).json(tasks).send();
};

const createTaskHandler: RequestHandler<Task, CreateTaskResponse | ErrorResponse> = (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Missing title.' }).send();
  }

  const id = createTask(title, description);
  const response = {
    id: JSON.stringify(id),
  };

  return res.status(200).json(response).send();
};

const deleteTaskHandler: RequestHandler<TaskParam, ErrorResponse> = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send();
  }
  if (!isUuid(id)) {
    return res.status(400).send();
  }
  const result = deleteTaskById(id);

  if (result === OperationResult.OK) {
    return res.status(200).send();
  }
  if (result === OperationResult.NOT_FOUND) {
    return res.status(404).send();
  }
  return res.status(503).send();
};

const searchTaskHandler: RequestHandler<TaskSearchParam, Task[] | ErrorResponse> = (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(204).send();
  }
  const result = searchTasks(content);

  if (!result) {
    return res.status(204).send();
  }
  return res.status(200).json(result).send();
};

const editTaskHandler: RequestHandler<TaskParam, Task | ErrorResponse> = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: 'Missing task id.' }).send();
  }
  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid task id.' }).send();
  }

  const { title, description, completed } = req.body;

  const result = updateTask(id, {
    title,
    description,
    completed,
  });
  if (result === OperationResult.NOT_FOUND) {
    return res.status(404).json({ error: 'No task found' }).send();
  }
  return res.status(200).json(result).send();
};

taskRouter.post('/task', createTaskHandler);
taskRouter.patch('/task/:id', editTaskHandler);
taskRouter.get('/task/:id', getTaskHandler);
taskRouter.get('/tasks', getTasksHandler);
taskRouter.get('/tasks/search', searchTaskHandler);
taskRouter.delete('/task/:id', deleteTaskHandler);
