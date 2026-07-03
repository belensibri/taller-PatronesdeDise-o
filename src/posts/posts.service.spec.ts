import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsService } from './posts.service';
import { Post, PostStatus } from './entities/post.entity';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

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
});
