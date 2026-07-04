import { PostStatus } from '../entities/post.entity';
export declare class UpdatePostDto {
    title?: string;
    content?: string;
    excerpt?: string | null;
    slug?: string;
    status?: PostStatus;
    author_id?: number;
}
