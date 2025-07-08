import { BaseModel } from 'src/common/entities/base.entity';
import { ChatModel } from './chat.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserModel } from 'src/users/entities/user.entity';
import { IsString } from 'class-validator';

@Entity()
export class MessageModel extends BaseModel {
  @ManyToOne(() => ChatModel, (chat) => chat.messages)
  chat: ChatModel;

  @ManyToOne(() => UserModel, (user) => user.messages)
  author: UserModel;

  @Column()
  @IsString()
  message: string;
}
