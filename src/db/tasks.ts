import { Database as BetterSqlite3Database } from 'better-sqlite3';
import { OperationResult } from '../models/result';
import { DatabaseTaskRow, Task, TaskUpdateParams } from '../models/task';

const isCompleted = (val: number) => (val === 1 ? true : false);

export const getTasks = (db: BetterSqlite3Database): [Tasks[], OperationResult] => {
  const fetchedTasks = db.prepare<[], DatabaseTaskRow>('SELECT * FROM tasks').all();
  const allTasks = fetchedTasks.map((task) => {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: isCompleted(task.completed),
      createdAt: new Date(task.createdAt),
    };
  });
  return [allTasks, OperationResult.OK];
};

export const getTask = (db: BetterSqlite3Database, id: string): [Task | object, OperationResult] => {
  const row = db.prepare<string, DatabaseTaskRow>('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!row) {
    return [{}, OperationResult.NOT_FOUND];
  }

  return [
    {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      completed: isCompleted(row.completed),
      createdAt: new Date(row.createdAt),
    },
    OperationResult.OK,
  ];
};

export const getTasksByTitle = (db: BetterSqlite3Database, searchTerm: string): [Task[], OperationResult] => {
  return db.prepare<string, DatabaseTaskRow>('SELECT * FROM tasks WHERE title LIKE ?').all(`%${searchTerm}%`);
};

export const getTasksByDescription = (db: BetterSqlite3Database, searchTerm: string): [Task[], OperationResult] => {
  return db.prepare<string, DatabaseTaskRow>('SELECT * FROM tasks WHERE description LIKE ?').all(`%${searchTerm}%`);
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
): [Task | object, OperationResult] => {
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
