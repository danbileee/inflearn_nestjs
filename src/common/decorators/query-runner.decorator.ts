import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryRunner as QueryRunnerClass } from 'typeorm';

export const QR = createParamDecorator((data, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  const qr = req.queryRunner as QueryRunnerClass;

  if (!qr) {
    throw new InternalServerErrorException('QueryRunner not found.');
  }

  return qr;
});
