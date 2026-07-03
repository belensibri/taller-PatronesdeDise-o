"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePostsTable1700000000000 = void 0;
const typeorm_1 = require("typeorm");
class CreatePostsTable1700000000000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'posts',
            columns: [
                new typeorm_1.TableColumn({
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'gen_random_uuid()',
                }),
                new typeorm_1.TableColumn({ name: 'title', type: 'varchar', length: '255', isNullable: false }),
                new typeorm_1.TableColumn({ name: 'content', type: 'text', isNullable: false }),
                new typeorm_1.TableColumn({ name: 'excerpt', type: 'varchar', length: '255', isNullable: true }),
                new typeorm_1.TableColumn({ name: 'slug', type: 'varchar', length: '255', isNullable: false, isUnique: true }),
                new typeorm_1.TableColumn({ name: 'status', type: 'varchar', length: '20', isNullable: false, default: "'draft'" }),
                new typeorm_1.TableColumn({ name: 'author_id', type: 'int', isNullable: false }),
                new typeorm_1.TableColumn({ name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }),
                new typeorm_1.TableColumn({ name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }),
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('posts');
    }
}
exports.CreatePostsTable1700000000000 = CreatePostsTable1700000000000;
//# sourceMappingURL=1700000000000-CreatePostsTable.js.map