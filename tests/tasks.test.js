const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

describe('Task API Endpoints', () => {
  // Clear the in-memory tasks array before each test runs
  // to ensure test isolation
  beforeEach(() => {
    taskService._reset();
  });

  describe('GET /tasks', () => {
    it('should return an empty array initially', async () => {
      // 1. Arrange: App is already configured, and database is reset.

      // 2. Act: Make a GET request to the /tasks endpoint
      const response = await request(app).get('/tasks');

      // 3. Assert: Check the status code and the response body
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return a list of inserted tasks', async () => {
      // 1. Arrange: Insert a couple of tasks into our state
      taskService.create({ title: 'Finish testing guide' });
      taskService.create({ title: 'Review PRs' });

      // 2. Act: Request the /tasks endpoint
      const response = await request(app).get('/tasks');

      // 3. Assert: Examine the results
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe('Finish testing guide');
      expect(response.body[1].title).toBe('Review PRs');
    });
  });

  describe('GET /tasks (Advanced Options)', () => {
    it('should filter tasks by status correctly', async () => {
      // 1. Arrange: Create multiple tasks with different statuses
      taskService.create({ title: 'Task 1', status: 'todo' });
      taskService.create({ title: 'Task 2', status: 'in_progress' });
      taskService.create({ title: 'Task 3', status: 'done' });
      taskService.create({ title: 'Task 4', status: 'todo' });

      // 2. Act: Request to get only 'todo' tasks
      const response = await request(app).get('/tasks?status=todo');

      // 3. Assert: Returns 200 and solely the 'todo' items
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.every(task => task.status === 'todo')).toBe(true);
    });

    it('should paginate tasks correctly', async () => {
      // 1. Arrange: Insert more than 15 tasks 
      // (Inserting 20 total so page 1 gets a complete batch of 10 tasks)
      for (let i = 0; i < 20; i++) {
        taskService.create({ title: `Generated Task ${i}` });
      }

      // 2. Act: Call pagination endpoint
      // Note: Because taskService offset logic is (page * limit), page=1 effectively retrieves items 10-19.
      const response = await request(app).get('/tasks?page=1&limit=10');

      // 3. Assert: Verify we only get the limited 10 elements
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(10);
    });

    it('should incorrectly filter tasks due to bug in status string matching (Edge Case)', async () => {
      // 1. Arrange: Create tasks with specific statuses
      taskService.create({ title: 'Task 1', status: 'in_progress' });
      taskService.create({ title: 'Task 2', status: 'todo' });

      // 2. Act: Call GET /tasks with partial status match
      const response = await request(app).get('/tasks?status=in');

      // 3. Assert: Even though we requested exact status "in", 
      // we get "in_progress" back because the backend uses .includes() instead of strict equality ===
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].status).toBe('in_progress');
    });
  });

  describe('POST /tasks', () => {
    it('should successfully create a new task and return it with an id', async () => {
      // 1. Arrange: Define a valid task payload
      const validPayload = {
        title: 'Implement POST tests',
        description: 'Write test cases for task creation',
        priority: 'high'
      };

      // 2. Act: Send the payload via POST request
      const response = await request(app)
        .post('/tasks')
        .send(validPayload);

      // 3. Assert: Check status code and verify the response includes an id and matching fields
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(validPayload.title);
      expect(response.body.description).toBe(validPayload.description);
      expect(response.body.priority).toBe(validPayload.priority);
      // Verify default status was set
      expect(response.body.status).toBe('todo');
    });

    it('should return a 400 error when payload has missing title', async () => {
      // 1. Arrange: Define an invalid payload missing the required title
      const invalidPayload = {
        description: 'This task is missing a title'
      };

      // 2. Act: Send the invalid payload via POST request
      const response = await request(app)
        .post('/tasks')
        .send(invalidPayload);

      // 3. Assert: Check that a 400 Bad Request is returned with an error property
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
describe('PATCH /tasks/:id/assign', () => {
  it('should successfully assign a task and return the updated task', async () => {
    // 1. Arrange: Create a task in memory
    const task = taskService.create({ title: 'Important assignment test' });
    const payload = { assignee: 'Jane Doe' };

    // 2. Act: Send the PATCH request
    const response = await request(app)
      .patch(`/tasks/${task.id}/assign`)
      .send(payload);

    // 3. Assert: Verify 200 OK and updated assignee property
    expect(response.status).toBe(200);
    expect(response.body.assignee).toBe(payload.assignee);
    expect(response.body.id).toBe(task.id);
  });

  it('should return a 404 error if the task is not found', async () => {
    // 1. Arrange: Define a payload and a fake ID
    const payload = { assignee: 'Jane Doe' };
    const nonExistentId = 'fake-uuid-1234';

    // 2. Act: Send PATCH request using fake ID
    const response = await request(app)
      .patch(`/tasks/${nonExistentId}/assign`)
      .send(payload);

    // 3. Assert: Verify 404 Not Found
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should return a 400 error if the assignee is invalid', async () => {
    // 1. Arrange: Create a task and an invalid empty payload
    const task = taskService.create({ title: 'Task expecting failure' });
    const invalidPayload = { assignee: '   ' }; // Empty string/spaces

    // 2. Act: Send the bad request
    const response = await request(app)
      .patch(`/tasks/${task.id}/assign`)
      .send(invalidPayload);

    // 3. Assert: Verify 400 Bad Request
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('assignee is required');
  });
});
