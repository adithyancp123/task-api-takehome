# Task API - Bug Report

## Overview
This document outlines functional issues discovered during the testing and analysis of the Task API. The bugs primarily affect data retrieval (pagination and filtering) and data integrity (task updates). Each report below details the steps to reproduce the issue alongside a suggested technical fix.

---

## 1. Pagination Offset Miscalculation
**Description**: The API incorrectly calculates the offset when paginating tasks. Because the query parser defaults the `page` parameter to `1`, the underlying `getPaginated` service uses `offset = page * limit`. This causes the first API call (page 1) to completely skip the first batch of results (items `0` through `limit - 1`).

**Expected Behavior**: Requesting `GET /tasks?page=1&limit=10` should return the first 10 tasks (items 0-9).

**Actual Behavior**: Requesting `GET /tasks?page=1&limit=10` acts as a request for "page 2," skipping the first 10 items and returning items 10-19. 

**Steps to Reproduce**:
1. Insert 15 tasks into the system via `POST /tasks`.
2. Make a request to `GET /tasks?page=1&limit=10`.
3. Observe that only 5 tasks are returned, skipping the first 10 entirely.

**Suggested Fix**: Update the offset calculation in `taskService.js` to account for 1-indexed page limits. 
```javascript
// taskService.js
const getPaginated = (page, limit) => {
  const offset = (page - 1) * limit; // Subtract 1 from page
  return tasks.slice(offset, offset + limit);
};
```

---

## 2. Inaccurate Status Filtering (Fuzzy Matching)
**Description**: The task filtering mechanism uses a fuzzy match (`.includes()`) instead of an exact string match (`===`). This causes unintended partial matches when a user searches for a substring that exists within another status (e.g., searching for "in" matches "in_progress").

**Expected Behavior**: Requesting `GET /tasks?status=in` should return an empty array if no task has exactly the status `"in"`.

**Actual Behavior**: Requesting `GET /tasks?status=in` returns tasks with the `"in_progress"` status because `"in_progress".includes("in")` evaluates to `true`.

**Steps to Reproduce**:
1. Create a task with the status `"in_progress"`.
2. Make a request to `GET /tasks?status=in`.
3. Observe that the API incorrectly returns the `"in_progress"` task.

**Suggested Fix**: Replace the string inclusion method with strict equality in the `getByStatus` method within `taskService.js`.
```javascript
// taskService.js
const getByStatus = (status) => tasks.filter((t) => t.status === status);
```

---

## 3. Mutually Exclusive Queries (Pagination & Filtering)
**Description**: The routing implementation uses early return statements for different query parameters, making it impossible to combine filtering and pagination. 

**Expected Behavior**: A user should be able to request `GET /tasks?status=todo&page=1&limit=5` and receive the first 5 tasks that have a "todo" status.

**Actual Behavior**: The API processes the `status` query first and returns immediately. If `status` is provided, pagination arguments (`page` and `limit`) are completely ignored.

**Steps to Reproduce**:
1. Insert 20 tasks, 15 of which have the `todo` status.
2. Make a request to `GET /tasks?status=todo&page=1&limit=5`.
3. Observe that all 15 "todo" tasks are returned simultaneously, ignoring the limit of 5.

**Suggested Fix**: Chain the data processing in `routes/tasks.js` so that data is filtered first, and then the filtered array is paginated.
```javascript
// routes/tasks.js
router.get('/', (req, res) => {
  const { status, page, limit } = req.query;
  let results = taskService.getAll();

  if (status) {
    results = results.filter(t => t.status === status);
  }

  if (page !== undefined || limit !== undefined) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;
    results = results.slice(offset, offset + limitNum);
  }

  res.json(results);
});
```

---

## 4. Priority Data Loss on Task Completion
**Description**: When a task is marked as complete via the `PATCH /tasks/:id/complete` endpoint, the service implicitly overwrites the task's prior priority setting and resets it to `"medium"`.

**Expected Behavior**: Marking a task as "done" should only alter its status and completion date. Its priority level (e.g., "high") should be preserved.

**Actual Behavior**: If a "high" priority task is completed, its priority is silently downgraded/modified to "medium."

**Steps to Reproduce**:
1. Create a high-priority task: `POST /tasks` with payload `{ "title": "Critical Bug", "priority": "high" }`.
2. Extract the task `id` and complete it via `PATCH /tasks/:id/complete`.
3. Observe the response payload; the `priority` property has changed from "high" to "medium".

**Suggested Fix**: Remove the priority override in the `completeTask` function.
```javascript
// taskService.js
const completeTask = (id) => {
  const task = findById(id);
  if (!task) return null;

  const updated = {
    ...task,
    // priority: 'medium', <-- Remove this line
    status: 'done',
    completedAt: new Date().toISOString(),
  };

  // ...
};
```
