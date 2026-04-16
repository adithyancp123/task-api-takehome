# Task API

🚀 Built as a take-home assignment demonstrating debugging, testing, and API design skills.

A robust, fully-tested REST API built with Node.js and Express.js for managing tasks. This system is designed for high reliability, featuring comprehensive CRUD operations, advanced filtering, and pagination semantics. 

## Purpose of this Assignment

This repository serves to demonstrate several core backend engineering capabilities:
- **Debugging unfamiliar code**: Analyzing and repairing broken configurations and routing abstractions.
- **Writing tests for reliability**: Authoring a robust test suite utilizing Jest and Supertest for TDD compliance.
- **Fixing real bugs**: Identifying and mathematically resolving faulty filtering logic and missing offset paginations.
- **Implementing new features**: Designing and fully testing the net-new `PATCH /tasks/:id/assign` endpoint from scratch.

## Quick Start

```bash
git clone https://github.com/adithyancp123/task-api-takehome.git
cd task-api-takehome
npm install
npm test
npm start
```

## Features
- **Complete Task Lifecycle**: Create, read, update, and delete tasks dynamically.
- **Advanced Querying**: Filter results seamlessly by status and paginate large responses for optimized client handling.
- **Workflow Management**: Mark tasks automatically as complete, assign ownership (`PATCH /tasks/:id/assign`), and fetch real-time task completion statistics.
- **Fault-Tolerant Validations**: Comprehensive input validation mechanisms to prevent corrupted system state.
- **Production-Ready Testing**: Built utilizing test-driven patterns, boasting an extensive Jest test-suite with over 80% coverage on core service layers and routing execution.

## Tech Stack
- **Node.js**: Asynchronous event-driven JavaScript runtime.
- **Express.js**: Lightweight HTTP routing protocol and server.
- **Jest**: Zero-configuration testing platform.
- **Supertest**: High-level abstraction for testing Express HTTP routes cleanly.

## Project Structure

- `src/routes/`: Express route handlers mapping HTTP verbs to endpoints.
- `src/services/`: Core business logic, data operations, and task array manipulation.
- `src/utils/`: Reusable payload constraints, validators, and error helpers.
- `tests/`: Automated integration tests enforcing application correctness via Jest.

## Design Decisions

- **RESTful Architecture**: Adheres strictly to core REST principles, utilizing appropriate HTTP conventions and predictable namespace routing.
- **Separation of Concerns**: Maintains a clean boundary isolation—acting HTTP controllers (`routes/`) are strictly decoupled from memory orchestration and business models (`services/`).
- **Validation Layering**: Defends application states proactively via strict reusable validators (`utils/validators.js`) mapped to immediate 400 rejection chains.
- **Test-First Methodology**: Extensively hardened operations under Jest/Supertest CI standards, ensuring bug resistance and 80%+ structural coverage margins.

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

All endpoints are prefixed under `http://localhost:3000`.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/tasks` | Retrieve all active tasks. Accepts `?status`, `?page`, and `?limit`. |
| `GET` | `/tasks/stats` | Retrieve aggregated global data on task completions and overdue rates. |
| `POST` | `/tasks` | Provision a new task object in the system. |
| `PUT` | `/tasks/:id` | Perform a replacement update on a given task's parameters. |
| `DELETE` | `/tasks/:id` | Remove a task object permanently. |
| `PATCH` | `/tasks/:id/complete`| Quickly toggle a specific task to a `done` state. |
| `PATCH` | `/tasks/:id/assign` | Reassign a specific task to a new user payload. |

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
Provision a new task in the system.

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
Reassign a specific task to a designated team member or user.

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

The API employs consistent, predictable JSON responses for all error states:
- `400 Bad Request`: Returned when input validation fails (e.g. missing fields, invalid payload data).
- `404 Not Found`: Returned when attempting to query, update, or assign a task ID that does not exist.

## Testing

This project employs a robust automated testing CI/CD workflow utilizing Jest to maintain system integrity.

### Test Results
- ✔ **All tests passing** (10/10)
- ✔ **Coverage**: ~80%

Run the full testing suite:
```bash
npm test
```

Generate a deep coverage report on system files:
```bash
npm run coverage
```

## Bug Fix Summary

*This project focused on identifying hidden bugs through testing and fixing them with minimal code changes.*

The system has been refactored over time to stabilize critical edge cases spanning routing logic and operational data handling:
- **Pagination Miscalculation**: Remediated a high-priority 0-indexed integer issue in the service offset logic, preventing the API from accidentally discarding primary/first-page data.
- **Routing Modules**: Rectified dependency shadowing and syntax conflicts within Express router bindings, guaranteeing healthy server startup processes.
- **Validation Strictness**: Adjusted filtering routines to avoid soft-inclusive regressions (enforcing type and strict-equality). 

## Assumptions and Trade-offs
- **In-Memory Storage**: The system relies on a transient in-memory array rather than a persistent database. This allows for immediate local execution but results in data loss upon server restart.
- **Simplicity Over Scalability**: The architecture prioritizes a straightforward, minimal Express setup rather than a heavily abstracted, horizontally scalable microservice framework.
- **No Authentication**: Endpoints remain public without authorization guards in order to reduce friction during testing and sandbox evaluations.
- **Focus on Correctness**: Primary development cycles were allocated to achieving high testability, fixing calculation logic, and building strong validators rather than producing feature bulk.

## Future Improvements
- **Add database (MongoDB/PostgreSQL)**: Migrate away from volatile in-memory arrays to a reliable, persistent database scheme.
- **Add authentication (JWT)**: Secure API routes by implementing robust JSON Web Token authorization layers.
- **Add validation library (Joi/Zod)**: Further enforce datatype strictness and schema assurance upon incoming payloads.
- **Add Docker support**: Containerize the execution environment for immediate, infrastructure-agnostic deployment.
