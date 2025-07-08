import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { PostCommentModel } from '../entities/post-comment.entity';

export class CreatePostCommentDto extends PickType(PostCommentModel, [
  'content',
]) {
  @IsString({
    each: true,
  })
  @IsOptional()
  images?: string[];
}
