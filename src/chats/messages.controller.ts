import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PaginateMessageDto } from './dto/paginate-message.dto';

@Controller('chats/:chatId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  paginateMessages(
    @Query() paginateMessageDto: PaginateMessageDto,
    @Param('chatId', ParseIntPipe) chatId: number,
  ) {
    return this.messagesService.paginateMessages(paginateMessageDto, chatId);
  }
}
