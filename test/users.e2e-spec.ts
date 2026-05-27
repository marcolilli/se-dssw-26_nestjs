import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { User, users } from '../src/users/users.controller';
import request from 'supertest';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;

  const mockUsers: User[] = [
    { id: 10, username: 'charlie', isAdmin: false, isActive: true },
    { id: 20, username: 'alice', isAdmin: true, isActive: false },
    { id: 30, username: 'bravo', isAdmin: false, isActive: false },
  ];

  beforeEach(async () => {
    users.length = 0;

    users.push(...mockUsers);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /users can filter users', () => {
    return request(app.getHttpServer())
      .get('/users?filter=isAdmin:true')
      .expect(200)
      .expect([{ id: 20, username: 'alice', isAdmin: true, isActive: false }]);
  });

  it('GET /users can sort users', () => {
    return request(app.getHttpServer())
      .get('/users?sort=username:asc')
      .expect(200)
      .expect([
        { id: 20, username: 'alice', isAdmin: true, isActive: false },
        { id: 30, username: 'bravo', isAdmin: false, isActive: false },
        { id: 10, username: 'charlie', isAdmin: false, isActive: true },
      ]);
  });

  afterEach(async () => {
    await app.close();
  });
});
