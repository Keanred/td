import Database, { Database as BetterSqlite3Database } from 'better-sqlite3';

export const createTasksTable = (db: BetterSqlite3Database): void => {
  db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);
};

export const openDb = (): BetterSqlite3Database => {
  const db = new Database('tmp/database.db');
  db.pragma('foreign_keys = ON');
  createTasksTable(db);
  return db;
};

export const closeDb = (db: BetterSqlite3Database): void => {
  db.close();
};
