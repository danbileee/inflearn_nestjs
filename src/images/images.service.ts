import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageModel } from './entities/image.entity';
import { QueryRunner, Repository } from 'typeorm';
import { join } from 'path';
import {
  ABSOLUTE_IMAGES_PATH,
  TEMP_PATH,
} from 'src/common/constants/path.const';
import { promises } from 'fs';
import { PaginateImageDto } from './dto/paginate-image.dto';
import { PaginationModel } from 'src/common/entities/pagination.entity';
import { PaginationService } from 'src/common/services/pagination.service';

@Injectable()
export class ImagesService {
  constructor(
    private readonly paginationService: PaginationService,
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
  ) {}

  async paginateImages(
    dto: PaginateImageDto,
  ): Promise<PaginationModel<ImageModel>> {
    return this.paginationService.paginate<ImageModel>({
      paginationDto: dto,
      repository: this.imageRepository,
      findManyOptions: {},
      path: 'images',
    });
  }

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<ImageModel>(ImageModel)
      : this.imageRepository;
  }

  async createImage(dto: CreateImageDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr);
    const tempFilePath = join(TEMP_PATH, dto.path);

    try {
      await promises.access(tempFilePath);
    } catch (e) {
      throw new BadRequestException('File does not exist.', e.message);
    }

    const newPath = join(ABSOLUTE_IMAGES_PATH, dto.path);

    /**
     * 이미지 생성 및 저장
     */
    const result = await repository.save(dto);

    /**
     * 이미지 파일 경로 이동
     */
    await promises.rename(tempFilePath, newPath);

    return result;
  }
}
