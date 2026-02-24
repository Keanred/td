import { RequestHandler, Router } from 'express';
import { UUIDTypes, validate } from 'uuid';
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
const errorResponse = (message: string, code: string): ErrorResponse => ({
  error: {
    message,
    code,
  },
});

const getTaskHandler: RequestHandler<TaskParam, Task | ErrorResponse> = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json(errorResponse('Missing task id.', 'BAD_REQUEST')).send();
  }
  if (!isUuid(id)) {
    return res.status(400).json(errorResponse('Invalid task id.', 'BAD_REQUEST')).send();
  }

  const task = fetchTaskById(id);

  return res.json(task).status(200).send();
};

const getTasksHandler: RequestHandler<unknown, Task[] | ErrorResponse> = (_req, res) => {
  const result = fetchTasks();
  return res.status(200).json(result).send();
};

const createTaskHandler: RequestHandler<Task, CreateTaskResponse | ErrorResponse> = (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json(errorResponse('Missing title.', 'BAD_REQUEST')).send();
  }

  const id = createTask(title, description);
  const response = {
    id: id,
  };

  return res.status(200).json(response).send();
};

const deleteTaskHandler: RequestHandler<TaskParam, UUIDTypes | ErrorResponse> = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json(errorResponse('Missing task id.', 'BAD_REQUEST')).send();
  }
  if (!isUuid(id)) {
    return res.status(400).json(errorResponse('Invalid task id.', 'BAD_REQUEST')).send();
  }

  const result = deleteTaskById(id);
  return res.status(200).json(result).send();
};

const searchTaskHandler: RequestHandler<TaskSearchParam, Task[] | ErrorResponse> = (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json(errorResponse('Missing search content.', 'BAD_REQUEST')).send();
  }
  const result = searchTasks(content);

  return res.status(200).json(result).send();
};

const editTaskHandler: RequestHandler<TaskParam, Task | ErrorResponse> = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json(errorResponse('Missing task id.', 'BAD_REQUEST')).send();
  }
  if (!isUuid(id)) {
    return res.status(400).json(errorResponse('Invalid task id.', 'BAD_REQUEST')).send();
  }

  const { title, description, completed } = req.body;

  const result = updateTask(id, {
    title,
    description,
    completed,
  });

  return res.status(200).json(result).send();
};

taskRouter.post('/task', createTaskHandler);
taskRouter.patch('/task/:id', editTaskHandler);
taskRouter.get('/task/:id', getTaskHandler);
taskRouter.get('/tasks', getTasksHandler);
taskRouter.post('/tasks/search', searchTaskHandler);
taskRouter.delete('/task/:id', deleteTaskHandler);
