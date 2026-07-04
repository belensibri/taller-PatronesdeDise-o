import { PostsService } from './posts.service';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    findAll(query: GetPostsQueryDto): Promise<{
        data: import("./posts.service").PostResponse[];
        meta: {
            total_items: number;
            per_page: number;
            current_page: number;
            total_pages: number;
        };
    }>;
    findOne(id: string): Promise<{
        data: import("./posts.service").PostResponse;
    }>;
    update(id: string, dto: UpdatePostDto): Promise<import("./entities/post.entity").Post>;
    partialUpdate(id: string, dto: UpdatePostDto): Promise<import("./entities/post.entity").Post>;
    remove(id: string): Promise<void>;
}
