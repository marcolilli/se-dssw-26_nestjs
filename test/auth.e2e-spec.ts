import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { users } from '../src/users/users.controller';
import request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  const PASSWORD_HASH =
    'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';

  beforeEach(async () => {
    users.length = 0;
    users.push(
      {
        id: 1,
        username: 'john_doe',
        isAdmin: false,
        isActive: true,
        password: PASSWORD_HASH,
      },
      {
        id: 2,
        username: 'admin_user',
        isAdmin: true,
        isActive: true,
        password: PASSWORD_HASH,
      },
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /auth/login returns an access token for valid credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'john_doe', password: '123' })
      .expect(201)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
        expect(typeof res.body.access_token).toBe('string');
      });
  });

  it('POST /auth/login returns 401 for wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'john_doe', password: 'wrong' })
      .expect(401);
  });

  it('POST /auth/login returns 401 for unknown user', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'unknown', password: '123' })
      .expect(401);
  });
});
