"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("./entities/post.entity");
let PostsService = class PostsService {
    postRepository;
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async create(dto) {
        const repository = this.getPostRepository();
        const status = dto.status ?? post_entity_1.PostStatus.DRAFT;
        const publishedAt = status === post_entity_1.PostStatus.PUBLISH ? new Date() : null;
        const post = repository.create({
            title: dto.title,
            content: dto.content,
            excerpt: dto.excerpt ?? null,
            slug: dto.slug ?? this.generateSlug(dto.title),
            status,
            author_id: dto.author_id,
            published_at: publishedAt,
        });
        const savedPost = await repository.save(post);
        return {
            data: this.mapPostToResponse(savedPost),
        };
    }
    async findAll(query) {
        const { page, per_page, search, status, author, orderby, order } = query;
        if (!this.postRepository) {
            return {
                data: [],
                meta: {
                    total_items: 0,
                    per_page,
                    current_page: page,
                    total_pages: 0,
                },
            };
        }
        const queryBuilder = this.postRepository.createQueryBuilder('post');
        if (status) {
            queryBuilder.andWhere('post.status = :status', { status });
        }
        if (author !== undefined) {
            queryBuilder.andWhere('post.author_id = :author', { author });
        }
        if (search) {
            queryBuilder.andWhere('(post.title ILIKE :search OR post.content ILIKE :search)', { search: `%${search}%` });
        }
        const orderByMap = {
            id: 'post.id',
            title: 'post.title',
            slug: 'post.slug',
            date: 'post.created_at',
        };
        const orderColumn = orderByMap[orderby] || 'post.created_at';
        queryBuilder.orderBy(orderColumn, order.toUpperCase());
        queryBuilder.skip((page - 1) * per_page);
        queryBuilder.take(per_page);
        const [items, total] = await queryBuilder.getManyAndCount();
        const mappedItems = items.map((item) => this.mapPostToResponse(item));
        const totalPages = Math.ceil(total / per_page);
        return {
            data: mappedItems,
            meta: {
                total_items: total,
                per_page,
                current_page: page,
                total_pages: totalPages,
            },
        };
    }
    async findOne(id) {
        const post = await this.findPostByIdOrFail(id);
        return {
            data: this.mapPostToResponse(post),
        };
    }
    async update(id, dto) {
        const repository = this.getPostRepository();
        const post = await this.findPostByIdOrFail(id);
        if (post.status === post_entity_1.PostStatus.TRASH) {
            throw new common_1.UnprocessableEntityException({
                error: {
                    code: 'UNPROCESSABLE',
                    message: 'No se puede modificar un post en estado trash.',
                },
            });
        }
        Object.assign(post, dto);
        return repository.save(post);
    }
    async remove(id) {
        const repository = this.getPostRepository();
        const post = await this.findPostByIdOrFail(id);
        await repository.remove(post);
    }
    async findPostByIdOrFail(id) {
        const repository = this.getPostRepository();
        const post = await repository.findOne({ where: { id } });
        if (!post) {
            throw this.createNotFoundException();
        }
        return post;
    }
    getPostRepository() {
        if (!this.postRepository) {
            throw this.createNotFoundException();
        }
        return this.postRepository;
    }
    createNotFoundException() {
        return new common_1.NotFoundException({
            error: { code: 'NOT_FOUND', message: 'El recurso solicitado no existe.' },
        });
    }
    mapPostToResponse(post) {
        return {
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            status: post.status,
            author_id: post.author_id,
            created_at: post.created_at,
            updated_at: post.updated_at,
            published_at: post.published_at,
        };
    }
    generateSlug(title) {
        return title
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PostsService);
//# sourceMappingURL=posts.service.js.map