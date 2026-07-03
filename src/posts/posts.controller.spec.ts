process.env.DB_ENABLED = 'false';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

describe('PostsController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /posts (success default)', async () => {
    const response = await request(app.getHttpServer())
      .get('/posts')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta.current_page).toBe(1);
    expect(response.body.meta.per_page).toBe(10);
  });

  it('GET /posts (validation error - invalid page)', async () => {
    const response = await request(app.getHttpServer())
      .get('/posts?page=0')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'El recurso contiene datos inválidos.',
      },
    });
  });

  it('GET /posts (validation error - invalid status)', async () => {
    const response = await request(app.getHttpServer())
      .get('/posts?status=invalid_status')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'El recurso contiene datos inválidos.',
      },
    });
  });

  it('GET /posts (validation error - invalid order)', async () => {
    const response = await request(app.getHttpServer())
      .get('/posts?order=up')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'El recurso contiene datos inválidos.',
      },
    });
  });
});
