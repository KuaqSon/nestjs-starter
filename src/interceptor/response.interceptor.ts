import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from 'src/shared/dtos/common.dtos';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((res: unknown) => this.responseHandler(res, context)));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  responseHandler(res: unknown, _context: ExecutionContext): ResponseDto<unknown> {
    return {
      result: res,
    };
  }
}
