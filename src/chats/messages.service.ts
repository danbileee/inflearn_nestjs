import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageModel } from './entities/message.entity';
import { Repository } from 'typeorm';
import { PaginationService } from 'src/common/services/pagination.service';
import { PaginationModel } from 'src/common/entities/pagination.entity';
import { PaginateMessageDto } from './dto/paginate-message.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserModel } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageModel)
    private readonly messagesRepository: Repository<MessageModel>,
    private readonly paginationService: PaginationService,
  ) {}

  async createMessage(
    createMessageDto: CreateMessageDto,
    author: Pick<UserModel, 'id'>,
  ) {
    const message = await this.messagesRepository.save({
      chat: {
        id: createMessageDto.chatId,
      },
      author,
      message: createMessageDto.message,
    });

    return this.messagesRepository.findOne({
      where: {
        id: message.id,
      },
      relations: {
        chat: true,
      },
      select: {
        chat: {
          id: true,
        },
      },
    });
  }

  async paginateMessages(
    dto: PaginateMessageDto,
    chatId: number,
  ): Promise<PaginationModel<MessageModel>> {
    return this.paginationService.paginate<MessageModel>({
      paginationDto: dto,
      repository: this.messagesRepository,
      findManyOptions: {
        where: {
          id: chatId,
        },
        relations: {
          author: true,
          chat: true,
        },
        select: {
          author: {
            id: true,
          },
          chat: {
            id: true,
          },
        },
      },
      path: 'chats/messages',
    });
  }
}
