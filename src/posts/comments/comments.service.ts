import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from 'src/common/services/pagination.service';
import { QueryRunner, Repository } from 'typeorm';
import { PaginatePostCommentDto } from './dto/paginate-post-comment.dto';
import { PaginationModel } from 'src/common/entities/pagination.entity';
import { PostCommentModel } from './entities/post-comment.entity';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UserModel } from 'src/users/entities/user.entity';
import { PostModel } from 'src/posts/entities/post.entity';
import { AuthorService } from 'src/common/services/author.service';

@Injectable()
export class PostCommentsService implements AuthorService {
  constructor(
    private readonly paginationService: PaginationService,
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
    @InjectRepository(PostCommentModel)
    private readonly postsCommentsRepository: Repository<PostCommentModel>,
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  async paginatePostComments(
    dto: PaginatePostCommentDto,
  ): Promise<PaginationModel<PostCommentModel>> {
    return this.paginationService.paginate<PostCommentModel>({
      paginationDto: dto,
      repository: this.postsCommentsRepository,
      findManyOptions: {
        relations: {
          author: true,
          post: true,
        },
      },
      path: 'posts/:postId/comments',
    });
  }

  async getPostCommentById(
    { id }: Pick<PostCommentModel, 'id'>,
    qr?: QueryRunner,
  ): Promise<PostCommentModel> {
    const repository = this.getRepository(qr);

    const comment = await repository.findOne({
      where: { id },
      relations: {
        author: true,
        post: true,
      },
    });

    if (!comment) throw new NotFoundException();

    return comment;
  }

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<PostCommentModel>(PostCommentModel)
      : this.postsCommentsRepository;
  }

  async createPostComment(
    {
      author,
      post: { id: postId },
      ...createPostCommentDto
    }: { author: Pick<UserModel, 'id'> } & {
      post: Pick<PostModel, 'id'>;
    } & Omit<CreatePostCommentDto, 'images'>,
    qr?: QueryRunner,
  ): Promise<PostCommentModel> {
    const repository = this.getRepository(qr);
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    const comment: PostCommentModel = repository.create({
      author,
      ...createPostCommentDto,
      post,
      likeCount: 0,
    });

    const newComment: PostCommentModel = await repository.save(comment);

    return newComment;
  }

  async updatePostComment({
    id,
    content,
  }: Partial<Omit<PostCommentModel, 'author'>>): Promise<PostCommentModel> {
    const comment = await this.postsCommentsRepository.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });

    if (content) {
      comment.content = content;
    }

    const newComment: PostCommentModel =
      await this.postsCommentsRepository.save(comment);

    return newComment;
  }

  async deletePostComment(
    { id }: Pick<PostCommentModel, 'id'>,
    qr?: QueryRunner,
  ): Promise<number> {
    const repository = this.getRepository(qr);

    await repository.delete({ id });

    return id;
  }

  async isAuthor(userId: number, resourceId: number): Promise<boolean> {
    return this.postsCommentsRepository.exists({
      where: {
        id: resourceId,
        author: {
          id: userId,
        },
      },
    });
  }
}
