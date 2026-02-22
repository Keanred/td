import { Database as BetterSqlite3Database } from 'better-sqlite3';
import { Task, TaskUpdateParams } from '../models/task';

export const getTasks = (db: BetterSqlite3Database) => {
  return db.prepare<[], Task>('SELECT * FROM tasks').all();
};

export const getTask = (db: BetterSqlite3Database, id: string) => {
  const row = db.prepare<string, Task>('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!row) {
    throw new Error('Task not found');
  }

  return {
    id: row.id,
    title: row.title,
    ...(row.description === undefined ? {} : { description: row.description }),
    completed: row.completed,
    createdAt: row.createdAt,
  };
};

export const getTaskByTitle = (db: BetterSqlite3Database, searchTerm: string) => {
  return db.prepare<string, Task>('SELECT * FROM tasks WHERE title LIKE ?').all(`%${searchTerm}%`);
};

export const getTaskByDescription = (db: BetterSqlite3Database, searchTerm: string) => {
  return db.prepare<string, Task>('SELECT * FROM tasks WHERE description LIKE ?').all(`%${searchTerm}%`);
};

export const deleteTask = (db: BetterSqlite3Database, id: string) => {
  const statement = db.prepare('DELETE FROM tasks WHERE id = ?');
  return statement.run(id);
};

export const editTask = (db: BetterSqlite3Database, id: string, updates: Omit<Task, 'id'>): Task => {
  const statement = db.prepare<TaskUpdateParams>(
    'UPDATE tasks SET title = ?, description = ?, completed = ?, createdAt = ? WHERE id = ?',
  );
  const runUpdate = db.transaction((payload: Omit<Task, 'id'>) => {
    const result = statement.run(
      payload.title,
      payload.description,
      payload.completed ? 1 : 0,
      payload.createdAt.toISOString(),
      id,
    );
    return result;
  });

  runUpdate(updates);
  return getTask(db, id);
};

export const insertTask = (db: BetterSqlite3Database, task: Task): string => {
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
  return task.id.toString();
};
