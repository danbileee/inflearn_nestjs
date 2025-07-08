import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { UserModel } from '../entities/user.entity';

export const User = createParamDecorator(
  (data: keyof UserModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as UserModel;

    if (!user) {
      throw new BadRequestException(
        'User not found. Please check if access token has been passed.',
      );
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
