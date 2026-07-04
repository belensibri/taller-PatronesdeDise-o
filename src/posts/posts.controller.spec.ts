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

  // ─── GET /posts ────────────────────────────────────────────────────────────

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

  // ─── PUT /posts/:id ────────────────────────────────────────────────────────

  it('PUT /posts/:id (not found — DB disabled)', async () => {
    const response = await request(app.getHttpServer())
      .put('/posts/00000000-0000-0000-0000-000000000001')
      .send({
        title: 'Título actualizado',
        content: 'Contenido actualizado',
        excerpt: 'Resumen',
        slug: 'titulo-actualizado',
        status: 'draft',
        author_id: 1,
      })
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'El recurso solicitado no existe.',
      },
    });
  });

  it('PUT /posts/:id (validation error - invalid status)', async () => {
    const response = await request(app.getHttpServer())
      .put('/posts/00000000-0000-0000-0000-000000000001')
      .send({
        title: 'Título',
        content: 'Contenido',
        excerpt: 'Resumen',
        slug: 'titulo',
        status: 'estado_invalido',
        author_id: 1,
      })
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'El recurso contiene datos inválidos.',
      },
    });
  });

  // ─── PATCH /posts/:id ──────────────────────────────────────────────────────

  it('PATCH /posts/:id (not found — DB disabled)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/posts/00000000-0000-0000-0000-000000000001')
      .send({ title: 'Solo el título' })
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'El recurso solicitado no existe.',
      },
    });
  });

  it('PATCH /posts/:id (validation error - invalid status)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/posts/00000000-0000-0000-0000-000000000001')
      .send({ status: 'estado_invalido' })
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'El recurso contiene datos inválidos.',
      },
    });
  });
});
