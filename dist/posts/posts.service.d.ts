import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
export declare class PostsService {
    private readonly postRepository?;
    constructor(postRepository?: Repository<Post> | undefined);
    findAll(): Promise<Post[]> | never[];
}
