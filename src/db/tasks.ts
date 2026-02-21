import { Database as BetterSqlite3Database, RunResult } from 'better-sqlite3';
import { UUID } from 'node:crypto';
import { Task } from '../models/task';

export const insertTask = (db: BetterSqlite3Database, task: Task): UUID => {
  const stmt = db.prepare(
    'INSERT INTO tasks (id, title, description, completed, createdAt, keywords) VALUES (?, ?, ?, ?, ?, ?)',
  );
  stmt.run(
    task.id,
    task.title,
    task.description,
    task.completed ? 1 : 0,
    task.createdAt.toISOString(),
    task.keywords || [],
  );
  return task.id;
};

export const getTasks = (db: BetterSqlite3Database) => {
  return db.prepare('SELECT * FROM tasks').all();
};

export const getTask = (db: BetterSqlite3Database, id: UUID) => {
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
};

export const getTaskByTitle = (db: BetterSqlite3Database, searchTerm: string) => {
  return db.prepare('SELECT * FROM tasks WHERE title LIKE ?').all(`%${searchTerm}%`);
};

export const getTaskByKeywords = (db: BetterSqlite3Database, searchTerm: string) => {
  return db.prepare('SELECT * FROM tasks WHERE title LIKE ?').all(`%${searchTerm}%`);
};

export const getTaskByDescription = (db: BetterSqlite3Database, searchTerm: string) => {
  return db.prepare('SELECT * FROM tasks WHERE title LIKE ?').all(`%${searchTerm}%`);
};

export const deteleTask = (db: BetterSqlite3Database, id: UUID) => {
  const statement = db.prepare(`DELETE col FROM tasks WHERE id = $`);
  return statement.run(id);
};

export const editTask = (db: BetterSqlite3Database, id: UUID) => {
  const statement = db.prepare(
    'UPDATE tasks SET title = ?, description = ?, completed = ?, createdAt = ?, keywords = ? WHERE id = ?',
import { Database as BetterSqlite3Database } from 'better-sqlite3';
import { UUID } from 'node:crypto';
import { Task } from '../models/task';

export const insertTask = (db: BetterSqlite3Database, task: Task): UUID => {
  const stmt = db.prepare(
    'INSERT INTO tasks (id, title, description, completed, createdAt, keywords) VALUES (?, ?, ?, ?, ?, ?)',
  );
  stmt.run(
    task.id,
    task.title,
  
  );
  return statement.run(
    updates.title,
    updates.description,
    updates.completed ? 1 : 0,
    updates.createdAt.toISOString(),
    updates.keywords,
    id,
  );
};
