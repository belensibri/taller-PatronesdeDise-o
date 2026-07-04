import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostStatus } from '../entities/post.entity';

export const STORE_POST_STATUSES = [
  PostStatus.DRAFT,
  PostStatus.PUBLISH,
  PostStatus.PENDING,
  PostStatus.PRIVATE,
] as const;

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  excerpt?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @IsIn(STORE_POST_STATUSES)
  status?: (typeof STORE_POST_STATUSES)[number];

  @Type(() => Number)
  @IsInt()
  author_id!: number;
}
