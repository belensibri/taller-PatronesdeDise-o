import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Post } from '../posts/entities/post.entity';
export declare const typeOrmConfig: {
    type: "postgres";
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl: boolean;
    entities: (typeof Post)[];
    synchronize: false;
    migrations: string[];
    migrationsRun: false;
    logging: false;
};
export declare const getTypeOrmConfig: (configService: ConfigService) => TypeOrmModuleOptions;
