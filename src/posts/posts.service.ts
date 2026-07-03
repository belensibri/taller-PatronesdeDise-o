import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';

@Injectable()
export class PostsService {
  constructor(
    @Optional()
    @InjectRepository(Post)
    private readonly postRepository?: Repository<Post>,
  ) {}

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

    // Map items to output format, including published_at mapped to created_at
    const mappedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      status: item.status,
      author_id: item.author_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      published_at: item.created_at,
    }));

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
}
