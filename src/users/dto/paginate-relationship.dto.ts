import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RelationshipModel } from '../entities/relationship.entity';
import { IsEnum, IsOptional } from 'class-validator';
import {
  RelationshipIncludeType,
  RelationshipIncludeTypes,
} from '../constants/relationship.const';

export class PaginateRelationshipDto extends PaginationDto.createWithConfig<RelationshipModel>(
  {
    allowedSortFields: ['createdAt', 'updatedAt', 'confirmedAt'],
    allowedFilterFields: [
      'createdAt',
      'updatedAt',
      'confirmedAt',
      'followee',
      'follower',
    ],
  },
) {
  @IsOptional()
  @IsEnum(RelationshipIncludeTypes)
  include?: RelationshipIncludeType;
}
