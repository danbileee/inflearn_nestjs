import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { UserRole, UserRoles } from '../constants/role.const';
import { PostModel } from 'src/posts/entities/post.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthMessage } from 'src/common/validators/length.validator';
import { emailMessage } from 'src/common/validators/email.validator';
import { Exclude } from 'class-transformer';
import { ChatModel } from 'src/chats/entities/chat.entity';
import { MessageModel } from 'src/chats/entities/message.entity';
import { PostCommentModel } from 'src/posts/comments/entities/post-comment.entity';
import { RelationshipModel } from './relationship.entity';

@Entity()
export class UserModel extends BaseModel {
  @Column({
    length: 20,
    unique: true,
  })
  @IsString()
  @Length(1, 20, {
    message: lengthMessage,
  })
  nickname: string;

  @Column({
    unique: true,
  })
  @IsString()
  @IsEmail(undefined, {
    message: emailMessage,
  })
  email: string;

  @Column()
  @IsString()
  @Length(3, 8, {
    message: lengthMessage,
  })
  @Exclude({
    toPlainOnly: true, // 응답에서만 제외됨 (backend DTO -> frontend plain object(JSON))
    toClassOnly: false, // 요청에서는 받아야 함 e.g. 회원가입 (frontend plain object(JSON) -> backend DTO)
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Object.values(UserRoles),
    default: UserRoles.User,
  })
  role: UserRole;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];

  @OneToMany(() => PostCommentModel, (comment) => comment.author)
  postComments: PostCommentModel[];

  @ManyToMany(() => ChatModel, (chat) => chat.users)
  @JoinTable()
  chats: ChatModel[];

  @OneToMany(() => MessageModel, (message) => message.author)
  messages: MessageModel[];

  @OneToMany(() => RelationshipModel, (relationship) => relationship.follower)
  followers: RelationshipModel[];

  @OneToMany(() => RelationshipModel, (relationship) => relationship.followee)
  followees: RelationshipModel[];

  @Column({
    default: 0,
  })
  followersCount: number;

  @Column({
    default: 0,
  })
  followeesCount: number;
}
