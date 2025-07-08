import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreatePostCommentDto } from './create-post-comment.dto';

export class UpdatePostCommentDto extends PartialType(
  OmitType(CreatePostCommentDto, ['images']),
) {
  @IsString({
    message: 'Content must be string type.',
  })
  @IsOptional()
  content?: string;
}
