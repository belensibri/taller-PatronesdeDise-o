export declare enum PostStatus {
    DRAFT = "draft",
    PENDING = "pending",
    PUBLISH = "publish",
    PRIVATE = "private",
    TRASH = "trash"
}
export declare class Post {
    id: string;
    title: string;
    content: string;
    excerpt: string | null;
    slug: string;
    status: PostStatus;
    author_id: number;
    created_at: Date;
    updated_at: Date;
}
