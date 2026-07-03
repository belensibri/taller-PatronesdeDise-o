import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
export declare class PostsService {
    private readonly postRepository?;
    constructor(postRepository?: Repository<Post> | undefined);
    findAll(query: GetPostsQueryDto): Promise<{
        data: {
            id: string;
            title: string;
            slug: string;
            excerpt: string | null;
            content: string;
            status: import("./entities/post.entity").PostStatus;
            author_id: number;
            created_at: Date;
            updated_at: Date;
            published_at: Date;
        }[];
        meta: {
            total_items: number;
            per_page: number;
            current_page: number;
            total_pages: number;
        };
    }>;
}
