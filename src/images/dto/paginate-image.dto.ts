import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ImageModel } from '../entities/image.entity';

export class PaginateImageDto extends PaginationDto.createWithConfig<ImageModel>(
  {
    allowedSortFields: ['createdAt', 'updatedAt', 'order', 'id'],
    allowedFilterFields: ['createdAt', 'updatedAt', 'type', 'targetId'],
  },
) {}
