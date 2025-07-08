import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { RelationshipModel } from './entities/relationship.entity';
import { PaginationService } from 'src/common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, RelationshipModel])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, PaginationService],
})
export class UsersModule {}
