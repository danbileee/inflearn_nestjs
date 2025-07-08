import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './entities/post.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { ImageModel } from 'src/images/entities/image.entity';
import { LogMiddleware } from 'src/common/middlewares/log.middleware';
import { PostCommentModel } from 'src/posts/comments/entities/post-comment.entity';
import { ImagesService } from 'src/images/images.service';
import { AuthorGuard } from '../common/guards/author.guard';
import { RelationshipModel } from 'src/users/entities/relationship.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      PostModel,
      PostCommentModel,
      UserModel,
      ImageModel,
      RelationshipModel,
    ]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    ImagesService,
    AuthService,
    UsersService,
    AuthorGuard,
  ],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes({
      path: 'posts/*path',
      method: RequestMethod.ALL,
    });
  }
}
