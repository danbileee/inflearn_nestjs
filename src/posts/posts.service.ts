import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsRelations, QueryRunner, Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { PaginationModel } from 'src/common/entities/pagination.entity';
import { ConfigService } from '@nestjs/config';
import { PaginationService } from 'src/common/services/pagination.service';
import { AuthorService } from 'src/common/services/author.service';

const PostRelations: FindOptionsRelations<PostModel> = {
  author: true,
};

@Injectable()
export class PostsService implements AuthorService {
  constructor(
    private readonly configService: ConfigService,
    private readonly paginationService: PaginationService,
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  async getAllPosts(): Promise<PostModel[]> {
    return this.postsRepository.find({
      relations: PostRelations,
    });
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost({
        author: { id: userId },
        title: `Temp title ${i + 1}`,
        content: `Temp content ${i + 1}`,
      });
    }
  }

  async paginatePosts(
    dto: PaginatePostDto,
  ): Promise<PaginationModel<PostModel>> {
    return this.paginationService.paginate<PostModel>({
      paginationDto: dto,
      repository: this.postsRepository,
      findManyOptions: {
        relations: PostRelations,
      },
      path: 'posts',
    });
  }

  async getPostById(
    { id }: Pick<PostModel, 'id'>,
    qr?: QueryRunner,
  ): Promise<PostModel> {
    const repository = this.getRepository(qr);

    const post = await repository.findOne({
      where: { id },
      relations: PostRelations,
    });

    if (!post) throw new NotFoundException();

    return post;
  }

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<PostModel>(PostModel)
      : this.postsRepository;
  }

  async createPost(
    {
      author,
      ...createPostDto
    }: { author: Pick<UserModel, 'id'> } & Omit<CreatePostDto, 'images'>,
    qr?: QueryRunner,
  ): Promise<PostModel> {
    const repository = this.getRepository(qr);
    const post: PostModel = repository.create({
      author,
      ...createPostDto,
      likeCount: 0,
    });

    const newPost: PostModel = await repository.save(post);

    return newPost;
  }

  async updatePost({
    id,
    title,
    content,
  }: Partial<Omit<PostModel, 'author'>>): Promise<PostModel> {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    const newPost: PostModel = await this.postsRepository.save(post);

    return newPost;
  }

  async deletePost({ id }: Pick<PostModel, 'id'>): Promise<number> {
    await this.postsRepository.delete({ id });

    return id;
  }

  async incrementCommentsCount(postId: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    await repository.increment(
      {
        id: postId,
      },
      'commentsCount',
      1,
    );
  }

  async decrementCommentsCount(postId: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    await repository.decrement(
      {
        id: postId,
      },
      'commentsCount',
      1,
    );
  }

  async isAuthor(userId: number, resourceId: number): Promise<boolean> {
    return this.postsRepository.exists({
      where: {
        id: resourceId,
        author: {
          id: userId,
        },
      },
    });
  }
}
