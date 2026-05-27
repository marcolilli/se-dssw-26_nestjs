import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Task, tasks } from '../src/tasks/tasks.data';
import request from 'supertest';

describe('Tasks API', () => {
  let app: INestApplication<App>;

  const mockTasks: Task[] = [
    { id: 1, title: 'Task 1', priority: 0, completed: false },
    { id: 2, title: 'Task 2', priority: 1, completed: true },
    { id: 3, title: 'Task 3', priority: 2, completed: false },
  ];

  beforeEach(async () => {
    tasks.length = 0;
    tasks.push(...mockTasks);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /tasks returns all tasks', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect(mockTasks);
  });

  it('GET /tasks?completed=true returns only completed tasks', () => {
    return request(app.getHttpServer())
      .get('/tasks?completed=true')
      .expect(200)
      .expect([{ id: 2, title: 'Task 2', priority: 1, completed: true }]);
  });

  it('GET /tasks?completed=false returns only incomplete tasks', () => {
    return request(app.getHttpServer())
      .get('/tasks?completed=false')
      .expect(200)
      .expect([
        { id: 1, title: 'Task 1', priority: 0, completed: false },
        { id: 3, title: 'Task 3', priority: 2, completed: false },
      ]);
  });

  it('GET /tasks?title= returns tasks matching the title', () => {
    return request(app.getHttpServer())
      .get('/tasks?title=Task 1')
      .expect(200)
      .expect([{ id: 1, title: 'Task 1', priority: 0, completed: false }]);
  });

  it('POST /tasks creates a new task marked as not completed', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Buy groceries', priority: 2 })
      .expect(201)
      .expect({ id: 4, title: 'Buy groceries', priority: 2, completed: false });
  });

  it('POST /tasks returns 400 when title is missing', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ priority: 1 })
      .expect(400);
  });

  it('POST /tasks returns 400 for an invalid priority', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Buy groceries', priority: 5 })
      .expect(400);
  });

  it('PATCH /tasks/:id/completed marks the task as completed', () => {
    return request(app.getHttpServer())
      .patch('/tasks/1/completed')
      .expect(200)
      .expect({ id: 1, title: 'Task 1', priority: 0, completed: true });
  });

  it('PATCH /tasks/:id/completed returns 404 for an unknown task', () => {
    return request(app.getHttpServer())
      .patch('/tasks/999/completed')
      .expect(404);
  });
});
