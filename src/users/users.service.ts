import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { IsNull, Not, QueryRunner, Repository } from 'typeorm';
import { RelationshipModel } from './entities/relationship.entity';
import { PaginateRelationshipDto } from './dto/paginate-relationship.dto';
import { PaginationModel } from 'src/common/entities/pagination.entity';
import { PaginationService } from 'src/common/services/pagination.service';
import { RelationshipIncludeTypes } from './constants/relationship.const';

@Injectable()
export class UsersService {
  constructor(
    private readonly paginationService: PaginationService,
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
    @InjectRepository(RelationshipModel)
    private readonly relationshipsRepository: Repository<RelationshipModel>,
  ) {}

  getUsersRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<UserModel>(UserModel)
      : this.usersRepository;
  }

  getRelationshipsRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<RelationshipModel>(RelationshipModel)
      : this.relationshipsRepository;
  }

  async createUser(
    userParams: Pick<UserModel, 'nickname' | 'email' | 'password'>,
  ) {
    const matchedNickname = await this.usersRepository.exists({
      where: {
        nickname: userParams.nickname,
      },
    });

    if (matchedNickname) {
      throw new BadRequestException('This nickname already exists');
    }

    const matchedEmail = await this.usersRepository.exists({
      where: {
        email: userParams.email,
      },
    });

    if (matchedEmail) {
      throw new BadRequestException('This email already exists');
    }

    const user = this.usersRepository.create(userParams);
    const createdUser = await this.usersRepository.save(user);

    return createdUser;
  }

  async getAllUSers() {
    return this.usersRepository.find({
      relations: {
        followers: true,
        followees: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async paginateFollowers(
    { include, ...dto }: PaginateRelationshipDto,
    followeeId: number,
  ): Promise<PaginationModel<RelationshipModel>> {
    return this.paginationService.paginate<RelationshipModel>({
      paginationDto: dto,
      repository: this.relationshipsRepository,
      findManyOptions: {
        where: {
          followee: {
            id: followeeId,
          },
          ...(include === RelationshipIncludeTypes.OnlyConfirmed
            ? {
                confirmedAt: Not(IsNull()),
              }
            : undefined),
        },
        relations: {
          follower: true,
        },
      },
      path: 'users/:userId/followers',
    });
  }

  async paginateFollowees(
    { include, ...dto }: PaginateRelationshipDto,
    followerId: number,
  ): Promise<PaginationModel<RelationshipModel>> {
    return this.paginationService.paginate<RelationshipModel>({
      paginationDto: dto,
      repository: this.relationshipsRepository,
      findManyOptions: {
        where: {
          follower: {
            id: followerId,
          },
          ...(include === RelationshipIncludeTypes.OnlyConfirmed
            ? {
                confirmedAt: Not(IsNull()),
              }
            : undefined),
        },
        relations: {
          followee: true,
        },
      },
      path: 'users/:userId/followees',
    });
  }

  async requestFollow(
    followerId: number,
    followeeId: number,
    qr?: QueryRunner,
  ) {
    const repository = this.getRelationshipsRepository(qr);
    const relationship = repository.create({
      follower: {
        id: followerId,
      },
      followee: {
        id: followeeId,
      },
    });
    await repository.save(relationship);

    return true;
  }

  async confirmFollow(
    followerId: number,
    followeeId: number,
    qr?: QueryRunner,
  ) {
    const repository = this.getRelationshipsRepository(qr);
    const relationship = await repository.findOne({
      where: {
        follower: {
          id: followerId,
        },
        followee: {
          id: followeeId,
        },
      },
      relations: {
        follower: true,
        followee: true,
      },
    });

    if (!relationship) {
      throw new BadRequestException('Relationship not found.');
    }

    await repository.save({
      ...relationship,
      confirmedAt: new Date(),
    });

    return true;
  }

  async cancelFollow(followerId: number, followeeId: number, qr?: QueryRunner) {
    const repository = this.getRelationshipsRepository(qr);

    await repository.delete({
      follower: {
        id: followerId,
      },
      followee: {
        id: followeeId,
      },
    });

    return true;
  }

  async incrementFollowersCount(userId: number, qr?: QueryRunner) {
    const repository = this.getUsersRepository(qr);

    await repository.increment(
      {
        id: userId,
      },
      'followersCount',
      1,
    );
  }

  async decrementFollowersCount(userId: number, qr?: QueryRunner) {
    const repository = this.getUsersRepository(qr);

    await repository.decrement(
      {
        id: userId,
      },
      'followersCount',
      1,
    );
  }

  async incrementFolloweesCount(userId: number, qr?: QueryRunner) {
    const repository = this.getUsersRepository(qr);

    await repository.increment(
      {
        id: userId,
      },
      'followeesCount',
      1,
    );
  }

  async decrementFolloweesCount(userId: number, qr?: QueryRunner) {
    const repository = this.getUsersRepository(qr);

    await repository.decrement(
      {
        id: userId,
      },
      'followeesCount',
      1,
    );
  }
}
