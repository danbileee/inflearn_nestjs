import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['images']),
) {
  @IsString({
    message: 'Tilte must be a string.',
  })
  @IsOptional()
  title?: string;

  @IsString({
    message: 'Content must be a string.',
  })
  @IsOptional()
  content?: string;
}
