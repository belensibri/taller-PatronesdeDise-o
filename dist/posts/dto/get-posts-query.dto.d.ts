import { PostStatus } from '../entities/post.entity';
export declare class GetPostsQueryDto {
    page: number;
    per_page: number;
    search?: string;
    status: PostStatus;
    author?: number;
    orderby: string;
    order: 'asc' | 'desc';
}
