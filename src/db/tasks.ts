import { Database as BetterSqlite3Database } from 'better-sqlite3';
import { OperationResult } from '../models/result';
import { DatabaseTaskRow, Task, TaskUpdateParams } from '../models/task';

const isCompleted = (val: number) => (val === 1 ? true : false);
const taskTransformer = (taskRow: DatabaseTaskRow): Task => {
  return {
    id: taskRow.id,
    title: taskRow.title,
    description: taskRow.description ?? undefined,
    completed: isCompleted(taskRow.completed),
    createdAt: new Date(taskRow.createdAt),
  };
};
export const getTasks = (db: BetterSqlite3Database): [Task[] | undefined, OperationResult] => {
  const fetchedTasks = db.prepare<[], DatabaseTaskRow>('SELECT * FROM tasks').all();
  if (!fetchedTasks) {
    return [undefined, OperationResult.NOT_FOUND];
  }
  const allTasks = fetchedTasks.map(taskTransformer);
  return [allTasks, OperationResult.OK];
};

export const getTask = (db: BetterSqlite3Database, id: string): [Task | undefined, OperationResult] => {
  const row = db.prepare<string, DatabaseTaskRow>('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!row) {
    return [undefined, OperationResult.NOT_FOUND];
  }

  return [taskTransformer(row), OperationResult.OK];
};

export const searchTaskByContent = (
  db: BetterSqlite3Database,
  searchTerm: string,
): [Task[] | undefined, OperationResult] => {
  const searchResult = db
    .prepare<string, DatabaseTaskRow>('SELECT * FROM tasks WHERE description LIKE ? OR title LIKE ?')
    .all(`%${searchTerm}%`);
  if (!searchResult) {
    return [undefined, OperationResult.NOT_FOUND];
  }
  const tasks = searchResult.map(taskTransformer);
  return [tasks, OperationResult.OK];
};

export const deleteTask = (db: BetterSqlite3Database, id: string): OperationResult => {
  const statement = db.prepare('DELETE FROM tasks WHERE id = ?');
  const runResult = statement.run(id);
  if (runResult.changes) {
    return OperationResult.OK;
  }
  return OperationResult.NOT_FOUND;
};

export const editTask = (
  db: BetterSqlite3Database,
  id: string,
  updates: Omit<Task, 'id'>,
): [Task | undefined, OperationResult] => {
  const statement = db.prepare<TaskUpdateParams, DatabaseTaskRow>(
    'UPDATE tasks SET title = ?, description = ?, completed = ?, createdAt = ? WHERE id = ?',
  );
  const runUpdate = db.transaction((payload: Omit<Task, 'id'>) => {
    const result = statement.run(
      payload.title,
      payload.description ?? undefined,
      payload.completed ? 1 : 0,
      payload.createdAt.toISOString(),
      id,
    );
    return result;
  });

  runUpdate(updates);
  return getTask(db, id);
};

export const insertTask = (db: BetterSqlite3Database, task: Task): [string, OperationResult] => {
  const insertTaskStatement = db.prepare(
    'INSERT INTO tasks (id, title, description, completed, createdAt) VALUES (?, ?, ?, ?, ?)',
  );
  const runInsert = db.transaction((newTask: Task) => {
    insertTaskStatement.run(
      newTask.id,
      newTask.title,
      newTask.description,
      newTask.completed ? 1 : 0,
      newTask.createdAt.toISOString(),
    );
  });

  runInsert(task);
  return [task.id.toString(), OperationResult.OK];
};
