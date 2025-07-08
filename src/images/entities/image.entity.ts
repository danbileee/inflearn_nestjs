import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../common/entities/base.entity';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ImageType, ImageTypes } from '../constants/image.const';
import { Transform } from 'class-transformer';
import { RELATIVE_IMAGES_PATH } from '../../common/constants/path.const';
import { join } from 'path';

@Entity()
export class ImageModel extends BaseModel {
  @Column({
    default: 0,
  })
  @IsInt()
  @IsOptional()
  order: number;

  @Column({
    enum: ImageTypes,
  })
  @IsEnum(ImageTypes)
  type: ImageType;

  @Column()
  @IsNumber()
  targetId: number;

  @Column()
  @IsString()
  @Transform(({ value, obj }) => {
    if (Object.values(ImageTypes).includes(obj.type)) {
      return `/${join(RELATIVE_IMAGES_PATH, value)}`;
    }
    return value;
  })
  path: string;
}
