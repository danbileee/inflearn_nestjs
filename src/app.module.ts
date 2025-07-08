import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { EnvKeys } from './common/constants/env.const';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_PATH } from './common/constants/path.const';
import { ChatsModule } from './chats/chats.module';
import { CommentsModule } from './posts/comments/comments.module';
import { ImagesModule } from './images/images.module';
import { RoleGuard } from './users/guards/role.guard';
import { AccessTokenGuard } from './auth/guards/token.guard';

@Module({
  imports: [
    PostsModule,
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_PATH,
      serveRoot: '/public',
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[EnvKeys.DB_HOST],
      port: parseInt(process.env[EnvKeys.DB_PORT]),
      username: process.env[EnvKeys.DB_USERNAME],
      password: process.env[EnvKeys.DB_PASSWORD],
      database: process.env[EnvKeys.DB_DATABASE],
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CommonModule,
    ChatsModule,
    CommentsModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
