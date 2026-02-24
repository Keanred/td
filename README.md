# Td Core API

A task management API built with TypeScript. This project serves as a backend for managing task data, focusing on code structure, server-side filtering and middleware patterns.

## Table of Contents
- [Core Features](#core-features)
- [Technical Stack](#technical-stack)
- [Architecture](#architecture)
- [API Specification](#api-specification)
- [Database Schema](#database-schema)
- [Setup & Installation](#setup--installation)

## Core Features
- **Layered Service Architecture**: Strict separation between HTTP handling, business logic, and database access.
- **Custom Logging Middleware**: A logger that captures request method, path, and payload.
- **Centralized Error Handling**: Global middleware for standardized JSON error responses and HTTP status code management.

## Technical Stack
- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (via [better-sqlite3])

## Architecture
The project follows a modular, layered design to ensure maintainability:

- `src/routes`: Manages HTTP endpoints, validates request inputs, and sends responses.
- `src/services`: Contains core business logic.
- `src/db`: Data Access Layer (DAL) for direct interaction with the SQLite database.
- `src/middleware`: Utility functions for logging and global error interception.
- `src/models`: Type definitions and interfaces for Task object.

## API Specification
All requests and responses use `application/json`.

### Endpoints
- `GET /api/task/:id`: Retrieve task
- `GET /api/tasks`: Retrieve tasks
- `POST /api/tasks/search`: Search tasks by content
- `POST /api/task`: Create a new task
- `PATCH /api/task/:id`: Update task fields or completion status
- `DELETE /api/task/:id`: Permanently remove a task

### Error Format
```json
{
  "error": {
    "message": "Detailed error description",
    "code": "BAD_REQUEST",
    "stack": "Optional stack trace in development"
  }
}
```

### Examples
All request/response examples assume `Content-Type: application/json`.

#### `GET /api/task/:id`
Response (200):
```json
{
  "id": "f5a1f2d4-2b85-4c8b-9f3a-4f3b9a9b1a2d",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "createdAt": "2026-02-24T10:15:30.000Z"
}
```
Response (400):
```json
{
  "error": {
    "message": "Invalid task id.",
    "code": "BAD_REQUEST"
  }
}
```
Response (404):
```json
{
  "error": {
    "message": "Resource not found",
    "code": "NOT_FOUND"
  }
}
```

#### `GET /api/tasks`
Response (200):
```json
[
  {
    "id": "f5a1f2d4-2b85-4c8b-9f3a-4f3b9a9b1a2d",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "createdAt": "2026-02-24T10:15:30.000Z"
  },
  {
    "id": "a3f2b5c6-1d2e-4f33-9b11-2a6b7c8d9e0f",
    "title": "Walk the dog",
    "description": "",
    "completed": true,
    "createdAt": "2026-02-23T08:05:10.000Z"
  }
]
```

#### `POST /api/tasks/search`
Request body:
```json
{
  "content": "groceries"
}
```
Response (200):
```json
[
  {
    "id": "f5a1f2d4-2b85-4c8b-9f3a-4f3b9a9b1a2d",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "createdAt": "2026-02-24T10:15:30.000Z"
  }
]
```
Response (400):
```json
{
  "error": {
    "message": "Missing search content.",
    "code": "BAD_REQUEST"
  }
}
```

#### `POST /api/task`
Request body:
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```
Response (200):
```json
{
  "id": "f5a1f2d4-2b85-4c8b-9f3a-4f3b9a9b1a2d"
}
```
Response (400):
```json
{
  "error": {
    "message": "Missing title.",
    "code": "BAD_REQUEST"
  }
}
```

#### `PATCH /api/task/:id`
Request body:
```json
{
  "title": "Buy groceries and snacks",
  "completed": true
}
```
Response (200):
```json
{
  "id": "f5a1f2d4-2b85-4c8b-9f3a-4f3b9a9b1a2d",
  "title": "Buy groceries and snacks",
  "description": "Milk, eggs, bread",
  "completed": true,
  "createdAt": "2026-02-24T10:15:30.000Z"
}
```
Response (404):
```json
{
  "error": {
    "message": "Resource not found",
    "code": "NOT_FOUND"
  }
}
```

#### `DELETE /api/task/:id`
Response (200):
```json
"f5a1f2d4-2b85-4c8b-9f3a-4f3b9a9b1a2d"
```
Response (400):
```json
{
  "error": {
    "message": "Invalid task id.",
    "code": "BAD_REQUEST"
  }
}
```

## Database Schema
The SQLite database contains a single `tasks` table.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT | UUID primary key |
| `title` | TEXT | Required task title |
| `description` | TEXT | Nullable description |
| `completed` | INTEGER | 0 = false, 1 = true |
| `createdAt` | TEXT | ISO-8601 timestamp |

## Setup & Installation
1. Install dependencies: `npm install`
2. Start the API: `npm run dev`