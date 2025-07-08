import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const now = new Date();
    const req = context.switchToHttp().getRequest();
    const path = req.originalUrl;

    console.log(`request: ${path} ${now.toLocaleString('kr')}`);

    return next.handle().pipe(
      // tap((observable) => console.log(observable)),
      // map((observable) => ({
      //   message: '응답이 변경되었습니다.',
      //   response: observable,
      // })),
      tap(() =>
        console.log(
          `response: ${path} ${new Date().toLocaleString('kr')} ${new Date().getMilliseconds() - now.getMilliseconds()}ms`,
        ),
      ),
    );
  }
}
