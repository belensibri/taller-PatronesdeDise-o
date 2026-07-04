import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PostStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PUBLISH = 'publish',
  PRIVATE = 'private',
  TRASH = 'trash',
}

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  excerpt!: string | null;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug!: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status!: PostStatus;

  @Column({ type: 'int' })
  author_id!: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at!: Date;

  @Column({ type: 'timestamp', name: 'published_at', nullable: true })
  published_at!: Date | null;
}
