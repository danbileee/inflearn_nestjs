import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { PostModel } from 'src/posts/entities/post.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class PostCommentModel extends BaseModel {
  @ManyToOne(() => UserModel, (user) => user.postComments, {
    nullable: false,
  })
  author: UserModel;

  @ManyToOne(() => PostModel, (post) => post.comments)
  post: PostModel;

  @Column()
  @IsString({
    message: 'Content must be a string.',
  })
  content: string;

  @Column()
  likeCount: number;
}
