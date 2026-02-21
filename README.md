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
- **Custom Logging Middleware**: A logger with configurable `logLevel` (DEBUG, INFO, WARN, ERROR).
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
- `POST /api/tasks`: Create a new task.
- `PATCH /api/tasks/:id`: Update task fields or completion status.
- `DELETE /api/tasks/:id`: Permanently remove a task.

### Error Format
```json
{
  "error": {
    "message": "Detailed error description",
    "code": "STATUS_CODE"
  }
}