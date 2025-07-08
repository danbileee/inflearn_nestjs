import { IsInt, IsString } from 'class-validator';
import { PostCommentModel } from 'src/posts/comments/entities/post-comment.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class PostModel extends BaseModel {
  @ManyToOne(() => UserModel, (user) => user.posts, {
    nullable: false,
  })
  author: UserModel;

  @Column()
  @IsString({
    message: 'Tilte must be a string.',
  })
  title: string;

  @Column()
  @IsString({
    message: 'Content must be a string.',
  })
  content: string;

  @Column()
  likeCount: number;

  @OneToMany(() => PostCommentModel, (comment) => comment.post)
  comments: PostCommentModel[];

  @Column({
    default: 0,
  })
  @IsInt()
  commentsCount: number;
}
