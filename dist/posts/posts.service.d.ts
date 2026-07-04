import { Repository } from 'typeorm';
import { Post, PostStatus } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export interface PostResponse {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    status: PostStatus;
    author_id: number;
    created_at: Date;
    updated_at: Date;
    published_at: Date | null;
}
export declare class PostsService {
    private readonly postRepository?;
    constructor(postRepository?: Repository<Post> | undefined);
    create(dto: CreatePostDto): Promise<{
        data: PostResponse;
    }>;
    findAll(query: GetPostsQueryDto): Promise<{
        data: PostResponse[];
        meta: {
            total_items: number;
            per_page: number;
            current_page: number;
            total_pages: number;
        };
    }>;
    findOne(id: string): Promise<{
        data: PostResponse;
    }>;
    update(id: string, dto: UpdatePostDto): Promise<Post>;
    remove(id: string): Promise<void>;
    private findPostByIdOrFail;
    private getPostRepository;
    private createNotFoundException;
    private mapPostToResponse;
    private generateSlug;
}
