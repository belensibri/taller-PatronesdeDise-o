import {
  Body,
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';

const uuidParamPipe = new ParseUUIDPipe({
  exceptionFactory: () =>
    new BadRequestException({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'El recurso contiene datos inválidos.',
      },
    }),
});

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query() query: GetPostsQueryDto) {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', uuidParamPipe) id: string) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto);
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', uuidParamPipe) id: string): Promise<void> {
    await this.postsService.remove(id);
  }
}
