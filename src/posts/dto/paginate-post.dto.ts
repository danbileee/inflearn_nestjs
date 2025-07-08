import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PostModel } from '../entities/post.entity';

export class PaginatePostDto extends PaginationDto.createWithConfig<PostModel>({
  allowedSortFields: [
    'createdAt',
    'updatedAt',
    'title',
    'content',
    'likeCount',
  ],
  allowedFilterFields: ['createdAt', 'updatedAt', 'likeCount'],
}) {}
