import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  // BadRequestException,
  // ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from './common/exception-filters/http.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      // exceptionFactory: (errors: ValidationError[]) => {
      //   console.log({ errors });
      //   return new BadRequestException({
      //     message: 'Validation failed',
      //     errors,
      //   });
      // },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
