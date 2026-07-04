import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsService } from './posts.service';
import { Post, PostStatus } from './entities/post.entity';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let repository: Repository<Post>;
  let mockQueryBuilder: any;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  // ─── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    const existingPost: Post = {
      id: 'uuid-1234',
      title: 'Título original',
      content: 'Contenido original',
      excerpt: 'Resumen original',
      slug: 'titulo-original',
      status: PostStatus.PUBLISH,
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

      await expect(service.findOne('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should query posts with default filters', async () => {
      const query: GetPostsQueryDto = {
        page: 1,
        per_page: 10,
        status: PostStatus.PUBLISH,
        orderby: 'date',
        order: 'desc',
      };

      const result = await service.findAll(query);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('post');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('post.status = :status', {
        status: PostStatus.PUBLISH,
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
      const query: GetPostsQueryDto = {
        page: 1,
        per_page: 10,
        status: PostStatus.PUBLISH,
        orderby: 'date',
        order: 'desc',
        search: 'design',
      };

      await service.findAll(query);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(post.title ILIKE :search OR post.content ILIKE :search)',
        { search: '%design%' },
      );
    });

    it('should apply author filter if author parameter is provided', async () => {
      const query: GetPostsQueryDto = {
        page: 1,
        per_page: 10,
        status: PostStatus.PUBLISH,
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
      const query: GetPostsQueryDto = {
        page: 1,
        per_page: 10,
        status: PostStatus.PUBLISH,
        orderby: 'title',
        order: 'asc',
      };

      await service.findAll(query);

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('post.title', 'ASC');
    });
  });

  // ─── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    const existingPost: Post = {
      id: 'uuid-1234',
      title: 'Título original',
      content: 'Contenido original',
      excerpt: 'Resumen original',
      slug: 'titulo-original',
      status: PostStatus.DRAFT,
      author_id: 1,
      created_at: new Date('2026-07-01T10:00:00Z'),
      updated_at: new Date('2026-07-01T10:00:00Z'),
    };

    it('should update and return the post with new values', async () => {
      const dto: UpdatePostDto = { title: 'Título actualizado', status: PostStatus.PUBLISH };
      const updatedPost = { ...existingPost, ...dto, updated_at: new Date() };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingPost);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedPost);

      const result = await service.update('uuid-1234', dto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1234' } });
      expect(repository.save).toHaveBeenCalled();
      expect(result.title).toBe('Título actualizado');
      expect(result.status).toBe(PostStatus.PUBLISH);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update('uuid-inexistente', {})).rejects.toThrow(NotFoundException);
    });

    it('should throw UnprocessableEntityException when post is in trash', async () => {
      const trashedPost: Post = { ...existingPost, status: PostStatus.TRASH };
      jest.spyOn(repository, 'findOne').mockResolvedValue(trashedPost);

      await expect(service.update('uuid-1234', { title: 'Nuevo título' })).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('should apply only the provided fields (partial update)', async () => {
      const dto: UpdatePostDto = { title: 'Solo título cambiado' };
      const savedPost = { ...existingPost, title: 'Solo título cambiado' };

      jest.spyOn(repository, 'findOne').mockResolvedValue({ ...existingPost });
      jest.spyOn(repository, 'save').mockResolvedValue(savedPost);

      const result = await service.update('uuid-1234', dto);

      expect(result.title).toBe('Solo título cambiado');
      expect(result.content).toBe(existingPost.content);
      expect(result.slug).toBe(existingPost.slug);
    });
  });

  // ─── remove ────────────────────────────────────────────────────────────────

  describe('remove', () => {
    const existingPost: Post = {
      id: 'uuid-1234',
      title: 'Título original',
      content: 'Contenido original',
      excerpt: 'Resumen original',
      slug: 'titulo-original',
      status: PostStatus.DRAFT,
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

      await expect(service.remove('uuid-inexistente')).rejects.toThrow(NotFoundException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
