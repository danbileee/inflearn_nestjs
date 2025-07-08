import { BaseModel } from 'src/common/entities/base.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Entity, ManyToMany, OneToMany } from 'typeorm';
import { MessageModel } from './message.entity';

@Entity()
export class ChatModel extends BaseModel {
  @ManyToMany(() => UserModel, (user) => user.chats)
  users: UserModel[];

  @OneToMany(() => MessageModel, (message) => message.chat)
  messages: MessageModel[];
}
