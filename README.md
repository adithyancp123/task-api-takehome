# 📋 Node.js Express Task API

A robust, fully-tested REST API built with **Node.js** and **Express.js** for managing tasks. This project features complete CRUD capabilities, advanced filtering, pagination, and built-in task statistics.

## ✨ Features
- **Full CRUD Operations**: Create, Read, Update, and Delete tasks efficiently.
- **Advanced Filtering & Pagination**: Filter tasks by status and seamlessly paginate results.
- **Task Assignment**: Reassign tasks dynamically (`PATCH /tasks/:id/assign`).
- **Real-time Statistics**: Fetch insights on to-do, in-progress, completed, and overdue tasks.
- **Comprehensive Testing**: Validated with **Jest** and **Supertest** achieving 80%+ test coverage.

## 🛠️ Tech Stack
- **JavaScript (Node.js)**
- **Express.js** (Routing & Middleware)
- **Jest** (Testing Framework)
- **Supertest** (HTTP Assertion for API testing)

## 🚀 Setup Instructions

1. **Clone the repository** (if applicable):
   ```bash
   git clone <your-repo-url>
   cd task-api
   ```

2. **Install dependencies**:
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Run the server**:
   ```bash
   npm start
   ```
   *The server will start running on port 3000 (or the port defined in your environment variables).*

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` | Get all tasks (Supports `?status`, `?page`, and `?limit`) |
| `GET` | `/tasks/stats` | Get statistics about tasks (counts by status, overdue) |
| `POST` | `/tasks` | Create a new task |
| `PUT` | `/tasks/:id` | Update an existing task's properties |
| `DELETE` | `/tasks/:id` | Delete a task |
| `PATCH` | `/tasks/:id/complete` | Mark a task as completed |
| `PATCH` | `/tasks/:id/assign` | Assign a task to a user |

## 🧪 Testing Instructions

The application relies on Jest and Supertest to ensure bulletproof reliability. To run the automated test suite:

1. **Run all tests**:
   ```bash
   npm test
   ```

2. **Run tests with coverage details**:
   ```bash
   npm run coverage
   ```

## 🐛 Bug Fix Summary
During the development and testing lifecycle, key issues were identified and successfully resolved:
- **Pagination Miscalculation**: Fixed a high-priority issue where the first page of results (`page=1`) was skipped entirely due to a 0-indexed offset bug.
- **Routing & Service Errors**: Resolved module conflicts and missing initializers that previously prevented the Express Router from running successfully.

## 🔮 Future Improvements
- **Database Integration**: Migrate the in-memory array to persistent storage using PostgreSQL or MongoDB.
- **Authentication**: Secure the API using JWT (JSON Web Tokens) to strictly restrict and manage user task scopes.
- **Enhanced Filtering Verification**: Convert fuzzy `.includes()` search mechanisms to strict equality matches to completely eliminate edge-case false positives (e.g., matching "in" incorrectly to "in_progress").

---

*Engineered meticulously with quality and testability in mind.*
