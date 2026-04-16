# Task API

![Tests](https://img.shields.io/badge/Tests-10%2F10_passing-success)

🚀 Built as a take-home assignment demonstrating debugging, testing, and API design skills.

A simple, RESTful API built with Node.js and Express.js. It features full CRUD operations, filtering, and pagination.

## Purpose of this Assignment

This repository demonstrates practical backend engineering skills:
- **Debugging unfamiliar code**: Analyzing and fixing broken routing setup and application logic.
- **Writing tests for reliability**: Creating a solid test suite with Jest and Supertest.
- **Fixing real bugs**: Repairing incorrect filtering logic and pagination bugs.
- **Implementing new features**: Designing and testing a new `PATCH /tasks/:id/assign` endpoint.

## Quick Start

```bash
git clone https://github.com/adithyancp123/task-api-takehome.git
cd task-api-takehome
npm install
npm test
npm start
```

## Features
- **Task Management**: Create, read, update, and delete tasks.
- **Filtering & Pagination**: Easily filter tasks by status and paginate results.
- **Task Actions**: Mark tasks as complete or flexibly assign them to a user.
- **Input Validation**: Safely rejects invalid requests so the server doesn't crash.
- **Testing**: Highly tested code using Jest to keep everything reliable.

## Tech Stack
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web server framework.
- **Jest**: Testing framework.
- **Supertest**: HTTP testing library.

## Project Structure

- `src/routes/`: Route handlers mapping HTTP methods to application actions.
- `src/services/`: Core logic and data manipulation.
- `src/utils/`: Reusable validation functions.
- `tests/`: Automated test files.

## Design Decisions

- **RESTful**: Uses standard HTTP methods and clean, predictable URLs.
- **Separation of Concerns**: Routes just handle HTTP requests, while services handle logic and data storage independently.
- **Validation Layers**: Uses reusable functions (`utils/validators.js`) to reject bad input before it hits business logic.
- **Test-First**: Built with testing in mind to prevent bugs and ensure code quality over time.

## Setup Instructions

**Prerequisites:** You must have [Node.js](https://nodejs.org/en/) installed on your local machine.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/adithyancp123/task-api-takehome.git
   cd task-api-takehome
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Start the local server**:
   ```bash
   npm start
   ```
   *The server will boot locally and begin accepting connections on port 3000.*

## API Endpoints

All endpoints are located at `http://localhost:3000`.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/tasks` | Get all tasks. Accepts `?status`, `?page`, and `?limit`. |
| `GET` | `/tasks/stats` | Get basic statistics about task completions and overdue items. |
| `POST` | `/tasks` | Create a new task. |
| `PUT` | `/tasks/:id` | Update a task. |
| `DELETE` | `/tasks/:id` | Delete a task. |
| `PATCH` | `/tasks/:id/complete`| Mark a task as done. |
| `PATCH` | `/tasks/:id/assign` | Assign a task to a user. |
| `GET` | `/health` | Server readiness check. Returns `{ "status": "OK" }`. |

## API Usage

Base URL for all local endpoints: `http://localhost:3000`

### 1. Retrieve Tasks (`GET /tasks`)
Fetch a list of tasks. You can optionally filter by `status` or paginate using `page` and `limit`.

**Request:**
```bash
curl -X GET "http://localhost:3000/tasks?status=todo&limit=5"
```

**Response:**
```json
[
  {
    "id": "1634567891011",
    "title": "Set up database infrastructure",
    "description": "Initialize Postgres container",
    "status": "todo",
    "priority": "high",
    "createdAt": "2026-04-16T12:00:00.000Z"
  }
]
```

### 2. Create a Task (`POST /tasks`)
Create a new task in the system.

**Request:**
```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{
  "title": "Write unit tests",
  "description": "Add 100% test coverage for validators",
  "priority": "high"
}'
```

**Response:**
```json
{
  "id": "1634567891012",
  "title": "Write unit tests",
  "description": "Add 100% test coverage for validators",
  "status": "todo",
  "priority": "high",
  "createdAt": "2026-04-16T12:05:00.000Z"
}
```

### 3. Assign a Task (`PATCH /tasks/:id/assign`)
Assign a specific task to a team member or user.

**Request:**
```bash
curl -X PATCH http://localhost:3000/tasks/1634567891012/assign \
-H "Content-Type: application/json" \
-d '{
  "assignee": "johndoe"
}'
```

**Response:**
```json
{
  "id": "1634567891012",
  "title": "Write unit tests",
  "description": "Add 100% test coverage for validators",
  "status": "todo",
  "priority": "high",
  "createdAt": "2026-04-16T12:05:00.000Z",
  "assignee": "johndoe"
}
```

## Local Verification

Run:
```bash
npm test
```
**Expected output:**
✔ 10/10 tests passing

Run server:
```bash
npm start
```
**Server runs on:**
`http://localhost:3000`

## Error Handling

The API returns consistent, predictable JSON responses for any errors:
- `400 Bad Request`: Returned when input validation fails (e.g. missing fields or bad payload types).
- `404 Not Found`: Returned when attempting to view or change a task that doesn't exist.

## Testing

This project uses Jest for automated testing to catch regressions.

### Test Results
- ✔ **All tests passing** (10/10)
- ✔ **Coverage**: ~80%

Run the full testing suite:
```bash
npm test
```

Generate a deep coverage report:
```bash
npm run coverage
```

## Bug Fix Summary

*This project focused on identifying hidden bugs through testing and fixing them with minimal code changes.*

This project resolved several critical bugs that were impacting functionality:
- **Pagination Bug**: Fixed a math issue where the first page of results was being entirely skipped due to an incorrect offset calculation.
- **Routing Import Error**: Fixed broken exports and imports between `app.js` and `routes.js` that caused server startup crashing.
- **Validation Match Bug**: Updated the status filtering checks to use strict equality (`===`) instead of loose string matching (`.includes()`), preventing incorrect matches.

## Assumptions and Trade-offs
- **In-Memory Storage**: Uses a simple JavaScript array instead of a database for quick testing (note: data will reset on server restart).
- **Simple Architecture**: Kept the Express server files lightweight instead of over-engineering the application.
- **No Authentication**: The endpoints do not require login headers, keeping it fast and easy to test securely without overhead.
- **Focus on Correctness**: Focused development time purely on fixing logic bugs and securing test coverage rather than adding unnecessary features.

## Future Improvements
- **Add database (MongoDB/PostgreSQL)**: Migrate away from volatile arrays to a reliable database.
- **Add authentication (JWT)**: Secure routes so only authenticated users can access the application.
- **Add validation library (Joi/Zod)**: Use a strict library to validate incoming API requests.
- **Add Docker support**: Containerize the app to make deployment easier.
