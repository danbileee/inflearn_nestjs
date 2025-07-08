import { Module } from '@nestjs/common';
import { PostCommentsService } from './comments.service';
import { PostCommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentModel } from './entities/post-comment.entity';
import { UsersService } from 'src/users/users.service';
import { ImageModel } from 'src/images/entities/image.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModel } from 'src/users/entities/user.entity';
import { PostModel } from 'src/posts/entities/post.entity';
import { PostsService } from 'src/posts/posts.service';
import { ImagesService } from 'src/images/images.service';
import { AuthorGuard } from '../../common/guards/author.guard';
import { RelationshipModel } from 'src/users/entities/relationship.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostModel,
      PostCommentModel,
      ImageModel,
      UserModel,
      RelationshipModel,
    ]),
    AuthModule,
  ],
  controllers: [PostCommentsController],
  providers: [
    PostsService,
    PostCommentsService,
    ImagesService,
    UsersService,
    AuthorGuard,
  ],
})
export class CommentsModule {}
