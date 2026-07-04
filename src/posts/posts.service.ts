import {
  Injectable,
  Optional,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostStatus } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';

export interface PostResponse {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: PostStatus;
  author_id: number;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
}

@Injectable()
export class PostsService {
  constructor(
    @Optional()
    @InjectRepository(Post)
    private readonly postRepository?: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto): Promise<{ data: PostResponse }> {
    const repository = this.getPostRepository();
    const status = dto.status ?? PostStatus.DRAFT;
    const publishedAt = status === PostStatus.PUBLISH ? new Date() : null;
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

  async findAll(query: GetPostsQueryDto) {
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

    // Filter by status
    if (status) {
      queryBuilder.andWhere('post.status = :status', { status });
    }

    // Filter by author
    if (author !== undefined) {
      queryBuilder.andWhere('post.author_id = :author', { author });
    }

    // Search query
    if (search) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Order mapping
    const orderByMap: Record<string, string> = {
      id: 'post.id',
      title: 'post.title',
      slug: 'post.slug',
      date: 'post.created_at',
    };
    const orderColumn = orderByMap[orderby] || 'post.created_at';
    queryBuilder.orderBy(orderColumn, order.toUpperCase() as 'ASC' | 'DESC');

    // Pagination
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

  async findOne(id: string): Promise<{ data: PostResponse }> {
    const post = await this.findPostByIdOrFail(id);

    return {
      data: this.mapPostToResponse(post),
    };
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const repository = this.getPostRepository();
    const post = await this.findPostByIdOrFail(id);

    if (post.status === PostStatus.TRASH) {
      throw new UnprocessableEntityException({
        error: {
          code: 'UNPROCESSABLE',
          message: 'No se puede modificar un post en estado trash.',
        },
      });
    }

    Object.assign(post, dto);
    return repository.save(post);
  }

  async remove(id: string): Promise<void> {
    const repository = this.getPostRepository();
    const post = await this.findPostByIdOrFail(id);

    await repository.remove(post);
  }

  private async findPostByIdOrFail(id: string): Promise<Post> {
    const repository = this.getPostRepository();

    const post = await repository.findOne({ where: { id } });

    if (!post) {
      throw this.createNotFoundException();
    }

    return post;
  }

  private getPostRepository(): Repository<Post> {
    if (!this.postRepository) {
      throw this.createNotFoundException();
    }

    return this.postRepository;
  }

  private createNotFoundException(): NotFoundException {
    return new NotFoundException({
      error: { code: 'NOT_FOUND', message: 'El recurso solicitado no existe.' },
    });
  }

  private mapPostToResponse(post: Post): PostResponse {
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

  private generateSlug(title: string): string {
    return title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
