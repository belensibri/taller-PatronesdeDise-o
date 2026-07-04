"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.DB_ENABLED = 'false';
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = require("supertest");
const app_module_1 = require("../app.module");
const http_exception_filter_1 = require("../common/filters/http-exception.filter");
describe('PostsController (Integration)', () => {
    let app;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
        app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
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
//# sourceMappingURL=posts.controller.spec.js.map