import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { PaginateImageDto } from './dto/paginate-image.dto';
import { PaginationModel } from 'src/common/entities/pagination.entity';
import { ImageModel } from './entities/image.entity';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  getImages(
    @Query() paginateImageDto: PaginateImageDto,
  ): Promise<PaginationModel<ImageModel>> {
    return this.imagesService.paginateImages(paginateImageDto);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  postImage(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename,
    };
  }
}
