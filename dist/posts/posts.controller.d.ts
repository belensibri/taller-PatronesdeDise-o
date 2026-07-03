import { PostsService } from './posts.service';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
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
