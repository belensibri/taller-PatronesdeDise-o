import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { PostsModule } from './posts/posts.module';
import { typeOrmConfig } from './database/typeorm.config';

const dbEnabled = process.env.DB_ENABLED !== 'false';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...(dbEnabled
      ? [
          TypeOrmModule.forRootAsync({
            useFactory: () => ({
              ...typeOrmConfig,
              autoLoadEntities: true,
              retryAttempts: 1,
              retryDelay: 1000,
              connectTimeoutMS: 5000,
            }),
          }),
        ]
      : []),
    HealthModule,
    PostsModule,
  ],
})
export class AppModule {}
