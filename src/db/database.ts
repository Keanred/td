import Database, { Database as BetterSqlite3Database } from 'better-sqlite3';

export const createTasksTable = (db: BetterSqlite3Database): void => {
  db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            completed INTEGER NOT NULL,
            createdAt TEXT NOT NULL
        )
    `);
};

export const openDb = (): BetterSqlite3Database => {
  const db = new Database('tmp/database.db');
  createTasksTable(db);
  return db;
};
