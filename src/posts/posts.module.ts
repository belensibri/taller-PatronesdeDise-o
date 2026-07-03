import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

const dbEnabled = process.env.DB_ENABLED?.toLowerCase() === 'true';

@Module({
  imports: dbEnabled ? [TypeOrmModule.forFeature([Post])] : [],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
