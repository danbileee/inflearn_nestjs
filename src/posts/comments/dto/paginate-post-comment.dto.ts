import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PostCommentModel } from '../entities/post-comment.entity';

export class PaginatePostCommentDto extends PaginationDto.createWithConfig<PostCommentModel>(
  {
    allowedSortFields: ['createdAt', 'updatedAt', 'content', 'likeCount'],
    allowedFilterFields: ['createdAt', 'updatedAt', 'likeCount'],
  },
) {}
