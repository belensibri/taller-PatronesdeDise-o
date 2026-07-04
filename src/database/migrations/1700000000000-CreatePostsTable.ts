import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class CreatePostsTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          }),
          new TableColumn({ name: 'title', type: 'varchar', length: '255', isNullable: false }),
          new TableColumn({ name: 'content', type: 'text', isNullable: false }),
          new TableColumn({ name: 'excerpt', type: 'varchar', length: '255', isNullable: true }),
          new TableColumn({ name: 'slug', type: 'varchar', length: '255', isNullable: false, isUnique: true }),
          new TableColumn({ name: 'status', type: 'varchar', length: '20', isNullable: false, default: "'draft'" }),
          new TableColumn({ name: 'author_id', type: 'int', isNullable: false }),
          new TableColumn({ name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }),
          new TableColumn({ name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }),
          new TableColumn({ name: 'published_at', type: 'timestamp', isNullable: true }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('posts');
  }
}
