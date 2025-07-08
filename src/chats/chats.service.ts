import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatModel } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { PaginationService } from 'src/common/services/pagination.service';
import { PaginateChatDto } from './dto/paginate-chat.dto';
import { PaginationModel } from 'src/common/entities/pagination.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatModel)
    private readonly chatRepository: Repository<ChatModel>,
    private readonly paginationService: PaginationService,
  ) {}

  async paginateChats(
    paginateChatDto: PaginateChatDto,
  ): Promise<PaginationModel<ChatModel>> {
    return this.paginationService.paginate<ChatModel>({
      paginationDto: paginateChatDto,
      repository: this.chatRepository,
      findManyOptions: {
        relations: {
          users: true,
        },
      },
      path: 'chats',
    });
  }

  async createChat(createChatDto: CreateChatDto) {
    const chat = await this.chatRepository.save({
      users: createChatDto.userIds.map((id) => ({ id })),
    });

    return this.chatRepository.findOne({
      where: {
        id: chat.id,
      },
    });
  }

  async checkIfChatExists(chatId: number) {
    const exists = await this.chatRepository.exists({
      where: {
        id: chatId,
      },
    });

    return exists;
  }
}
