"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeOrmConfig = exports.typeOrmConfig = void 0;
const post_entity_1 = require("../posts/entities/post.entity");
exports.typeOrmConfig = {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'cms_foundation',
    ssl: process.env.DB_SSL === 'true',
    entities: [post_entity_1.Post],
    synchronize: false,
    migrations: ['dist/database/migrations/*.js'],
    migrationsRun: false,
    logging: false,
};
const getTypeOrmConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'postgres'),
    database: configService.get('DB_NAME', 'cms_foundation'),
    ssl: configService.get('DB_SSL', false),
    entities: [post_entity_1.Post],
    synchronize: false,
    migrations: ['dist/database/migrations/*.js'],
    migrationsRun: false,
    logging: false,
});
exports.getTypeOrmConfig = getTypeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map