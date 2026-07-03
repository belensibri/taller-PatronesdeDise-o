import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query() query: GetPostsQueryDto) {
    return this.postsService.findAll(query);
  }
}
