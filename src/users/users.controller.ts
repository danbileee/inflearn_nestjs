import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from './decorators/role.decorator';
import { UserRoles } from './constants/role.const';
import { User } from './decorators/user.decorator';
import { UserModel } from './entities/user.entity';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { PaginateRelationshipDto } from './dto/paginate-relationship.dto';
import { PaginationModel } from 'src/common/entities/pagination.entity';
import { RelationshipModel } from './entities/relationship.entity';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { QR } from 'src/common/decorators/query-runner.decorator';
import { QueryRunner } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRoles.Admin)
  getUsers() {
    return this.usersService.getAllUSers();
  }

  @Get(':id/followers')
  @PublicRoute()
  getFollowers(
    @Param('id', ParseIntPipe) followeeId: number,
    @Query() paginateRelationshipDto: PaginateRelationshipDto,
  ): Promise<PaginationModel<RelationshipModel>> {
    return this.usersService.paginateFollowers(
      paginateRelationshipDto,
      followeeId,
    );
  }

  @Get(':id/followees')
  @PublicRoute()
  getFollowees(
    @Param('id', ParseIntPipe) followerId: number,
    @Query() paginateRelationshipDto: PaginateRelationshipDto,
  ): Promise<PaginationModel<RelationshipModel>> {
    return this.usersService.paginateFollowees(
      paginateRelationshipDto,
      followerId,
    );
  }

  @Post(':id/request-follow')
  async postRequestFollow(
    @User() user: UserModel,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    await this.usersService.requestFollow(user.id, followeeId);

    return true;
  }

  @Patch(':id/confirm-follow')
  @UseInterceptors(TransactionInterceptor)
  async patchConfirmFollow(
    @User() user: UserModel,
    @Param('id', ParseIntPipe) followerId: number,
    @QR() qr: QueryRunner,
  ) {
    await this.usersService.confirmFollow(followerId, user.id, qr);
    await this.usersService.incrementFollowersCount(user.id, qr);
    await this.usersService.incrementFolloweesCount(followerId, qr);

    return true;
  }

  @Delete(':id/cancel-follow')
  async deleteCancelFollow(
    @User() user: UserModel,
    @Param('id', ParseIntPipe) followeeId: number,
    @QR() qr: QueryRunner,
  ) {
    await this.usersService.cancelFollow(user.id, followeeId);
    await this.usersService.decrementFollowersCount(user.id, qr);
    await this.usersService.decrementFolloweesCount(followeeId, qr);

    return true;
  }
}
