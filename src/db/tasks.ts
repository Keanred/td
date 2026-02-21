import { Database as BetterSqlite3Database } from 'better-sqlite3';
import { UUID } from 'node:crypto';
import { Task } from '../models/task';

export const getTasks = (db: BetterSqlite3Database) => {
  return db.prepare('SELECT * FROM tasks').all();
};

export const getTask = (db: BetterSqlite3Database, id: UUID) => {
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
};

export const getTaskByTitle = (db: BetterSqlite3Database, searchTerm: string) => {
  return db.prepare('SELECT * FROM tasks WHERE title LIKE ?').all(`%${searchTerm}%`);
};

export const getTaskByDescription = (db: BetterSqlite3Database, searchTerm: string) => {
  return db.prepare('SELECT * FROM tasks WHERE description LIKE ?').all(`%${searchTerm}%`);
};

export const deteleTask = (db: BetterSqlite3Database, id: UUID) => {
  const statement = db.prepare('DELETE FROM tasks WHERE id = ?');
  return statement.run(id);
};

export const editTask = (db: BetterSqlite3Database, id: UUID, updates: Omit<Task, 'id'>) => {
  const statement = db.prepare(
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

  return runUpdate(updates);
};

export const insertTask = (db: BetterSqlite3Database, task: Task): UUID => {
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
  return task.id;
};
