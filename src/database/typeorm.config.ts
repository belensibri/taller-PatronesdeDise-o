import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Post } from '../posts/entities/post.entity';

export const typeOrmConfig = {
  type: 'postgres' as const,
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'cms_foundation',
  ssl: process.env.DB_SSL === 'true',
  entities: [Post],
  synchronize: false,
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: false,
  logging: false,
} satisfies TypeOrmModuleOptions;

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_NAME', 'cms_foundation'),
  ssl: configService.get<boolean>('DB_SSL', false),
  entities: [Post],
  synchronize: false,
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: false,
  logging: false,
});
