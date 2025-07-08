import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MessageModel } from '../entities/message.entity';

export class PaginateMessageDto extends PaginationDto.createWithConfig<MessageModel>(
  {
    allowedSortFields: ['createdAt', 'updatedAt'],
    allowedFilterFields: ['createdAt', 'updatedAt'],
  },
) {}
