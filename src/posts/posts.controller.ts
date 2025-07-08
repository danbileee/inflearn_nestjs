import {
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
import { PostsService } from './posts.service';
import { PostModel } from './entities/post.entity';
import { User } from 'src/users/decorators/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { PaginationModel } from 'src/common/entities/pagination.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { ImageTypes } from 'src/images/constants/image.const';
import { DataSource, QueryRunner } from 'typeorm';
// import { LogInterceptor } from 'src/common/interceptors/log.interceptor';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { QR } from 'src/common/decorators/query-runner.decorator';
import { ImagesService } from 'src/images/images.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { AuthorGuard } from '../common/guards/author.guard';
import { Author } from 'src/common/decorators/author.decorator';
import { UserRoles } from 'src/users/constants/role.const';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly imagesService: ImagesService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * GET /posts
   * 모든 포스트를 다 가져온다.
   */
  @Get()
  @PublicRoute()
  // @UseInterceptors(LogInterceptor)
  getPosts(
    @Query() paginatePostDto: PaginatePostDto,
  ): Promise<PaginationModel<PostModel>> {
    return this.postsService.paginatePosts(paginatePostDto);
  }

  /**
   * GET /posts/:id
   * id에 매칭되는 포스트를 가져온다.
   */
  @Get(':id')
  @PublicRoute()
  getPost(@Param('id', ParseIntPipe) id: number): Promise<PostModel> {
    return this.postsService.getPostById({ id });
  }

  /**
   * POST /posts/random
   * 랜덤으로 포스트를 100개 생성한다.
   */
  @Post('random')
  async postPostsRandom(@User() user: UserModel) {
    await this.postsService.generatePosts(user.id);

    return true;
  }

  /**
   * POST /posts
   * 새로운 포스트를 생성한다.
   */
  @Post()
  @UseInterceptors(TransactionInterceptor)
  async postPosts(
    @User('id') userId: number,
    @Body() createPostDto: CreatePostDto,
    @QR() qr: QueryRunner,
  ): Promise<PostModel> {
    const post = await this.postsService.createPost(
      {
        author: { id: userId },
        ...createPostDto,
      },
      qr,
    );

    if (createPostDto.images) {
      for (let i = 0; i < createPostDto.images.length; i++) {
        await this.imagesService.createImage(
          {
            order: i,
            path: createPostDto.images[i],
            type: ImageTypes.Post,
            targetId: post.id,
          },
          qr,
        );
      }
    }

    return this.postsService.getPostById({ id: post.id }, qr);
  }

  /**
   * PATCH /posts/:id
   * id에 매칭되는 포스트를 변경한다.
   */
  @Patch(':id')
  @UseGuards(AuthorGuard)
  @Author({
    service: PostsService,
  })
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto?: UpdatePostDto,
  ): Promise<PostModel> {
    return this.postsService.updatePost({
      id,
      ...updatePostDto,
    });
  }

  /**
   * DELETE /posts/:id
   * id에 매칭되는 포스트를 삭제한다.
   */
  @Delete(':id')
  @UseGuards(AuthorGuard)
  @Author({
    service: PostsService,
    bypassRoles: [UserRoles.Admin],
  })
  deletePost(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.postsService.deletePost({ id });
  }
}
