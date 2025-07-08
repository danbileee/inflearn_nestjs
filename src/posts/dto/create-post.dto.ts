import { PickType } from '@nestjs/mapped-types';
import { PostModel } from '../entities/post.entity';
import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto extends PickType(PostModel, ['title', 'content']) {
  @IsString({
    each: true,
  })
  @IsOptional()
  images?: string[];
}
