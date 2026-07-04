"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const posts_service_1 = require("./posts.service");
const post_entity_1 = require("./entities/post.entity");
describe('PostsService', () => {
    let service;
    let repository;
    let mockQueryBuilder;
    beforeEach(async () => {
        mockQueryBuilder = {
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
        };
        const mockRepository = {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
            findOne: jest.fn(),
            remove: jest.fn(),
            save: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                posts_service_1.PostsService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(post_entity_1.Post),
                    useValue: mockRepository,
                },
            ],
        }).compile();
        service = module.get(posts_service_1.PostsService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(post_entity_1.Post));
    });
    describe('findOne', () => {
        const existingPost = {
            id: 'uuid-1234',
            title: 'Título original',
            content: 'Contenido original',
            excerpt: 'Resumen original',
            slug: 'titulo-original',
            status: post_entity_1.PostStatus.PUBLISH,
            author_id: 1,
            created_at: new Date('2026-07-01T10:00:00Z'),
            updated_at: new Date('2026-07-01T10:00:00Z'),
        };
        it('should return a post wrapped in data', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(existingPost);
            const result = await service.findOne('uuid-1234');
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1234' } });
            expect(result).toEqual({
                data: {
                    id: existingPost.id,
                    title: existingPost.title,
                    slug: existingPost.slug,
                    excerpt: existingPost.excerpt,
                    content: existingPost.content,
                    status: existingPost.status,
                    author_id: existingPost.author_id,
                    created_at: existingPost.created_at,
                    updated_at: existingPost.updated_at,
                    published_at: existingPost.created_at,
                },
            });
        });
        it('should throw NotFoundException when post does not exist', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            await expect(service.findOne('uuid-inexistente')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('findAll', () => {
        it('should query posts with default filters', async () => {
            const query = {
                page: 1,
                per_page: 10,
                status: post_entity_1.PostStatus.PUBLISH,
                orderby: 'date',
                order: 'desc',
            };
            const result = await service.findAll(query);
            expect(repository.createQueryBuilder).toHaveBeenCalledWith('post');
            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('post.status = :status', {
                status: post_entity_1.PostStatus.PUBLISH,
            });
            expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('post.created_at', 'DESC');
            expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
            expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
            expect(result).toEqual({
                data: [],
                meta: {
                    total_items: 0,
                    per_page: 10,
                    current_page: 1,
                    total_pages: 0,
                },
            });
        });
        it('should apply search filter if search parameter is provided', async () => {
            const query = {
                page: 1,
                per_page: 10,
                status: post_entity_1.PostStatus.PUBLISH,
                orderby: 'date',
                order: 'desc',
                search: 'design',
            };
            await service.findAll(query);
            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('(post.title ILIKE :search OR post.content ILIKE :search)', { search: '%design%' });
        });
        it('should apply author filter if author parameter is provided', async () => {
            const query = {
                page: 1,
                per_page: 10,
                status: post_entity_1.PostStatus.PUBLISH,
                orderby: 'date',
                order: 'desc',
                author: 5,
            };
            await service.findAll(query);
            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('post.author_id = :author', {
                author: 5,
            });
        });
        it('should map sort columns correctly', async () => {
            const query = {
                page: 1,
                per_page: 10,
                status: post_entity_1.PostStatus.PUBLISH,
                orderby: 'title',
                order: 'asc',
            };
            await service.findAll(query);
            expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('post.title', 'ASC');
        });
    });
    describe('update', () => {
        const existingPost = {
            id: 'uuid-1234',
            title: 'Título original',
            content: 'Contenido original',
            excerpt: 'Resumen original',
            slug: 'titulo-original',
            status: post_entity_1.PostStatus.DRAFT,
            author_id: 1,
            created_at: new Date('2026-07-01T10:00:00Z'),
            updated_at: new Date('2026-07-01T10:00:00Z'),
        };
        it('should update and return the post with new values', async () => {
            const dto = { title: 'Título actualizado', status: post_entity_1.PostStatus.PUBLISH };
            const updatedPost = { ...existingPost, ...dto, updated_at: new Date() };
            jest.spyOn(repository, 'findOne').mockResolvedValue(existingPost);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedPost);
            const result = await service.update('uuid-1234', dto);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1234' } });
            expect(repository.save).toHaveBeenCalled();
            expect(result.title).toBe('Título actualizado');
            expect(result.status).toBe(post_entity_1.PostStatus.PUBLISH);
        });
        it('should throw NotFoundException when post does not exist', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            await expect(service.update('uuid-inexistente', {})).rejects.toThrow(common_1.NotFoundException);
        });
        it('should throw UnprocessableEntityException when post is in trash', async () => {
            const trashedPost = { ...existingPost, status: post_entity_1.PostStatus.TRASH };
            jest.spyOn(repository, 'findOne').mockResolvedValue(trashedPost);
            await expect(service.update('uuid-1234', { title: 'Nuevo título' })).rejects.toThrow(common_1.UnprocessableEntityException);
        });
        it('should apply only the provided fields (partial update)', async () => {
            const dto = { title: 'Solo título cambiado' };
            const savedPost = { ...existingPost, title: 'Solo título cambiado' };
            jest.spyOn(repository, 'findOne').mockResolvedValue({ ...existingPost });
            jest.spyOn(repository, 'save').mockResolvedValue(savedPost);
            const result = await service.update('uuid-1234', dto);
            expect(result.title).toBe('Solo título cambiado');
            expect(result.content).toBe(existingPost.content);
            expect(result.slug).toBe(existingPost.slug);
        });
    });
    describe('remove', () => {
        const existingPost = {
            id: 'uuid-1234',
            title: 'Título original',
            content: 'Contenido original',
            excerpt: 'Resumen original',
            slug: 'titulo-original',
            status: post_entity_1.PostStatus.DRAFT,
            author_id: 1,
            created_at: new Date('2026-07-01T10:00:00Z'),
            updated_at: new Date('2026-07-01T10:00:00Z'),
        };
        it('should remove an existing post', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(existingPost);
            jest.spyOn(repository, 'remove').mockResolvedValue(existingPost);
            await expect(service.remove('uuid-1234')).resolves.toBeUndefined();
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1234' } });
            expect(repository.remove).toHaveBeenCalledWith(existingPost);
        });
        it('should throw NotFoundException when post does not exist', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            await expect(service.remove('uuid-inexistente')).rejects.toThrow(common_1.NotFoundException);
            expect(repository.remove).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=posts.service.spec.js.map