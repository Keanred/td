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

  if (!task) {
    return res.status(404).json(errorResponse('Task not found.', 'NOT_FOUND')).send();
  }

  return res.json(task).status(200).send();
};

const getTasksHandler: RequestHandler<unknown, Task[] | ErrorResponse> = (_req, res) => {
  const result = fetchTasks();
  if (result === OperationResult.NOT_FOUND) {
    return res.status(404).json(errorResponse('Tasks not found.', 'NOT_FOUND')).send();
  }
  return res.status(200).json(result).send();
};

const createTaskHandler: RequestHandler<Task, CreateTaskResponse | ErrorResponse> = (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json(errorResponse('Missing title.', 'BAD_REQUEST')).send();
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
    return res.status(400).json(errorResponse('Missing task id.', 'BAD_REQUEST')).send();
  }
  if (!isUuid(id)) {
    return res.status(400).json(errorResponse('Invalid task id.', 'BAD_REQUEST')).send();
  }
  const result = deleteTaskById(id);

  if (result === OperationResult.OK) {
    return res.status(200).send();
  }
  if (result === OperationResult.NOT_FOUND) {
    return res.status(404).json(errorResponse('Task not found.', 'NOT_FOUND')).send();
  }
  return res.status(500).json(errorResponse('Task deletion failed.', 'INTERNAL_ERROR')).send();
};

const searchTaskHandler: RequestHandler<TaskSearchParam, Task[] | ErrorResponse> = (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json(errorResponse('Missing search content.', 'BAD_REQUEST')).send();
  }
  const result = searchTasks(content);

  if (result === OperationResult.NOT_FOUND) {
    return res.status(404).json(errorResponse('No tasks match the search.', 'NOT_FOUND')).send();
  }
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
  if (result === OperationResult.NOT_FOUND) {
    return res.status(404).json(errorResponse('Task not found.', 'NOT_FOUND')).send();
  }
  return res.status(200).json(result).send();
};

taskRouter.post('/task', createTaskHandler);
taskRouter.patch('/task/:id', editTaskHandler);
taskRouter.get('/task/:id', getTaskHandler);
taskRouter.get('/tasks', getTasksHandler);
taskRouter.get('/tasks/search', searchTaskHandler);
taskRouter.delete('/task/:id', deleteTaskHandler);
