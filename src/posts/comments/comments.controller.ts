import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostCommentsService } from './comments.service';
import { PaginatePostCommentDto } from './dto/paginate-post-comment.dto';
import { PaginationModel } from 'src/common/entities/pagination.entity';
import { PostCommentModel } from './entities/post-comment.entity';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { User } from 'src/users/decorators/user.decorator';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { QueryRunner } from 'typeorm';
import { QR } from 'src/common/decorators/query-runner.decorator';
import { ImageTypes } from 'src/images/constants/image.const';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { ImagesService } from 'src/images/images.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { AuthorGuard } from '../../common/guards/author.guard';
import { Author } from 'src/common/decorators/author.decorator';
import { PostsService } from '../posts.service';

@Controller('posts/:postId/comments')
export class PostCommentsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postCommentsService: PostCommentsService,
    private readonly imagesService: ImagesService,
  ) {}

  @Get()
  @PublicRoute()
  getPostComments(
    @Query() paginatePostCommentsDto: PaginatePostCommentDto,
  ): Promise<PaginationModel<PostCommentModel>> {
    return this.postCommentsService.paginatePostComments(
      paginatePostCommentsDto,
    );
  }

  @Get(':id')
  @PublicRoute()
  async getPostComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) commentId: number,
  ): Promise<PostCommentModel> {
    const comment = await this.postCommentsService.getPostCommentById({
      id: commentId,
    });

    if (comment.post.id !== postId) {
      throw new BadRequestException(
        `This comment doesn't belong to the given post id.`,
      );
    }

    return comment;
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async postPostComment(
    @Param('postId', ParseIntPipe) postId: number,
    @User('id') userId: number,
    @Body() createPostCommentDto: CreatePostCommentDto,
    @QR() qr: QueryRunner,
  ): Promise<PostCommentModel> {
    const postComment = await this.postCommentsService.createPostComment(
      {
        author: { id: userId },
        post: { id: postId },
        ...createPostCommentDto,
      },
      qr,
    );

    if (createPostCommentDto.images) {
      for (let i = 0; i < createPostCommentDto.images.length; i++) {
        await this.imagesService.createImage(
          {
            order: i,
            path: createPostCommentDto.images[i],
            type: ImageTypes.PostComment,
            targetId: postComment.id,
          },
          qr,
        );
      }
    }

    await this.postsService.incrementCommentsCount(postId, qr);

    return this.postCommentsService.getPostCommentById(
      { id: postComment.id },
      qr,
    );
  }

  @Patch(':id')
  @UseGuards(AuthorGuard)
  @Author({
    service: PostCommentsService,
  })
  async patchPostComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Body() updatePostCommentDto?: UpdatePostCommentDto,
  ): Promise<PostCommentModel> {
    const updatedComment = await this.postCommentsService.updatePostComment({
      id: commentId,
      ...updatePostCommentDto,
    });

    return updatedComment;
  }

  @Delete(':id')
  @UseGuards(AuthorGuard)
  @Author({
    service: PostCommentsService,
  })
  @UseInterceptors(TransactionInterceptor)
  async deletePostComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @QR() qr: QueryRunner,
  ): Promise<number> {
    const deletedId = await this.postCommentsService.deletePostComment({
      id: commentId,
    });
    await this.postsService.decrementCommentsCount(postId, qr);

    return deletedId;
  }
}
