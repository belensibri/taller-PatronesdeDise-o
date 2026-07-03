import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @Optional()
    @InjectRepository(Post)
    private readonly postRepository?: Repository<Post>,
  ) {}

  findAll() {
    return this.postRepository?.find() ?? [];
  }
}
