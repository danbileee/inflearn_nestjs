import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`req: ${req.url} ${new Date().toLocaleString('kr')}`);
    console.log(`res: ${res.body} ${new Date().toLocaleString('kr')}`);

    next();
  }
}
