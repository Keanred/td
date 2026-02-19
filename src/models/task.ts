import { UUID } from "node:crypto";

interface Task {
    id: UUID;
    title: string;
    description: string;
    completed: boolean;
    ceatedAt: Date;
}