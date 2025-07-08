import { BadRequestException, Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as Multer from 'multer';
import { TEMP_PATH } from 'src/common/constants/path.const';
import { v4 as uuid } from 'uuid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModel } from './entities/image.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModel } from 'src/users/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { RelationshipModel } from 'src/users/entities/relationship.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([ImageModel, UserModel, RelationshipModel]),
    MulterModule.register({
      limits: {
        fileSize: 10000000, // byte
      },
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        console.log({ ext });

        if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
          return cb(
            new BadRequestException('Only jpg/jpeg/png files are allowed.'),
            false,
          );
        }

        return cb(null, true);
      },
      storage: Multer.diskStorage({
        destination: (req, res, cb) => {
          cb(null, TEMP_PATH);
        },
        filename: (req, file, cb) => {
          cb(null, `${uuid()}${extname(file.originalname).toLowerCase()}`);
        },
      }),
    }),
  ],
  controllers: [ImagesController],
  providers: [ImagesService, AuthService, UsersService, PaginationService],
  exports: [ImagesService],
})
export class ImagesModule {}
