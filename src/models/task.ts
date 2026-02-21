import { UUID } from 'node:crypto';

export type Task = {
  id: UUID;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  keywords?: string[];
};
