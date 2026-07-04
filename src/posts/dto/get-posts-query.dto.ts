import { IsOptional, IsInt, Min, Max, IsString, IsEnum, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { PostStatus } from '../entities/post.entity';

export class GetPostsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  per_page: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PostStatus)
  status: PostStatus = PostStatus.PUBLISH;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  author?: number;

  @IsOptional()
  @IsIn(['id', 'title', 'slug', 'date'])
  orderby: string = 'date';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order: 'asc' | 'desc' = 'desc';
}
