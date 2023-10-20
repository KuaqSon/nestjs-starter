import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HEADER } from 'src/shared/constant/request';
import { ResponseDto } from 'src/shared/dtos/common.dtos';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const ignoreStackTrace = exception instanceof HttpException || process.env.NODE_ENV === 'production';

    this.logger.error(
      'Exception filter catch %s with message: %s. Stack: %s',
      (exception as Error).name,
      (exception as Error).message,
      (exception as Error).stack
    );

    if (response) {
      const responseBody: ResponseDto<unknown> = {
        result: null,
        requestId: request.headers[HEADER.X_REQUEST_ID] as string,
        errorDetails: exception.response?.message || exception.message || exception?.detail,
        stack: ignoreStackTrace ? undefined : exception.response?.stack || exception.stack,
      };
      this.logger.log('Responding with status: %s and body: %j', status, responseBody);
      response.status(status).json(responseBody);
    }
  }
}
