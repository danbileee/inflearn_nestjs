import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    /**
     * 에러 모니터링 서비스에 로그 전송용 API 연동
     */

    /**
     * 동작 확인을 위한 임시 코드
     */
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toLocaleString('kr'),
      path: request.url,
      ...(typeof errorResponse === 'object'
        ? errorResponse
        : { message: errorResponse }),
    });
  }
}
