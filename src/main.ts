import Database from 'better-sqlite3';
import bodyparser from 'body-parser';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { closeDb, openDb } from './db/database';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import { taskRouter } from './routes/taskHandler';

const app = express();
app.use(bodyparser.json());
app.use(logger);

const tmpDir = path.resolve(process.cwd(), 'tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

export const db: Database.Database = openDb();

app.use('/api', taskRouter);

app.use(errorHandler);

process.on('SIGINT', () => {
  console.log('Closing database connection...');
  closeDb(db);
  process.exit();
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
