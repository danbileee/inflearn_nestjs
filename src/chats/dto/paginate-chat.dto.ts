import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ChatModel } from '../entities/chat.entity';

export class PaginateChatDto extends PaginationDto.createWithConfig<ChatModel>({
  allowedSortFields: ['createdAt', 'updatedAt'],
  allowedFilterFields: ['createdAt', 'updatedAt'],
}) {}
