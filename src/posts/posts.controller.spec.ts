process.env.DB_ENABLED = 'false';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostStatus } from './entities/post.entity';

const validationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    transform: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });

describe('PostsController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(validationPipe());
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
      .expect(422);

    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'El recurso contiene datos inválidos.',
        details: [{ field: 'page' }],
      },
    });
  });

  it('GET /posts (validation error - invalid status)', async () => {
    const response = await request(app.getHttpServer())
      .get('/posts?status=invalid_status')
      .expect(422);

    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'El recurso contiene datos inválidos.',
        details: [{ field: 'status' }],
      },
    });
  });

  it('GET /posts (validation error - invalid order)', async () => {
    const response = await request(app.getHttpServer())
      .get('/posts?order=up')
      .expect(422);

    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'El recurso contiene datos inválidos.',
        details: [{ field: 'order' }],
      },
    });
  });

  // ─── GET /posts/:id ────────────────────────────────────────────────────────

  it('GET /posts/:id (not found — DB disabled)', async () => {
    const response = await request(app.getHttpServer())
      .get('/posts/00000000-0000-4000-8000-000000000001')
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'El recurso solicitado no existe.',
      },
    });
  });

  it('GET /posts/:id (validation error - invalid id)', async () => {
    const response = await request(app.getHttpServer())
      .get('/posts/id-invalido')
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
      .expect(422);

    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'El recurso contiene datos inválidos.',
        details: [{ field: 'status' }],
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
      .expect(422);

    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'El recurso contiene datos inválidos.',
        details: [{ field: 'status' }],
      },
    });
  });

  // ─── DELETE /posts/:id ─────────────────────────────────────────────────────

  it('DELETE /posts/:id (not found — DB disabled)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/posts/00000000-0000-4000-8000-000000000001')
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'El recurso solicitado no existe.',
      },
    });
  });

  it('DELETE /posts/:id (validation error - invalid id)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/posts/id-invalido')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'El recurso contiene datos inválidos.',
      },
    });
  });
});

describe('PostsController (Store)', () => {
  let app: INestApplication;
  const createdPost = {
    id: '00000000-0000-4000-8000-000000000001',
    title: 'Nuevo post',
    slug: 'nuevo-post',
    excerpt: null,
    content: 'Contenido del post',
    status: PostStatus.DRAFT,
    author_id: 1,
    created_at: new Date('2026-07-04T10:00:00Z'),
    updated_at: new Date('2026-07-04T10:00:00Z'),
    published_at: null,
  };
  const postsService = {
    create: jest.fn().mockResolvedValue({ data: createdPost }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: postsService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(validationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  beforeEach(() => {
    postsService.create.mockClear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /posts creates a post and returns 201 with the full resource', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: 'Nuevo post',
        content: 'Contenido del post',
        author_id: 1,
      })
      .expect(201);

    expect(postsService.create).toHaveBeenCalledWith({
      title: 'Nuevo post',
      content: 'Contenido del post',
      author_id: 1,
    });
    expect(response.body).toEqual({
      data: {
        ...createdPost,
        created_at: createdPost.created_at.toISOString(),
        updated_at: createdPost.updated_at.toISOString(),
        published_at: null,
      },
    });
  });

  it.each([
    ['title', { content: 'Contenido', author_id: 1 }],
    ['content', { title: 'Titulo', author_id: 1 }],
    ['author_id', { title: 'Titulo', content: 'Contenido' }],
    ['status', { title: 'Titulo', content: 'Contenido', author_id: 1, status: 'invalid' }],
    ['status', { title: 'Titulo', content: 'Contenido', author_id: 1, status: 'trash' }],
  ])('POST /posts returns 422 and indicates %s when validation fails', async (field, payload) => {
    const response = await request(app.getHttpServer()).post('/posts').send(payload).expect(422);

    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'El recurso contiene datos inválidos.',
        details: [{ field }],
      },
    });
    expect(postsService.create).not.toHaveBeenCalled();
  });
});
