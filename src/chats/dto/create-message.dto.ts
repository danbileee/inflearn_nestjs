import { PickType } from '@nestjs/mapped-types';
import { MessageModel } from '../entities/message.entity';
import { IsNumber } from 'class-validator';

export class CreateMessageDto extends PickType(MessageModel, ['message']) {
  @IsNumber()
  chatId: number;
}
