import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';
import safeStringify from 'fast-safe-stringify';

@Injectable()
export class AspectLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AspectLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    const { url, method, params, query, body } = req;
    const user = req.user ? { id: req.user.id, email: req.user.email } : undefined;

    this.logger.debug(
      `REQUEST DATA \n${safeStringify(
        {
          url,
          method,
          params,
          query,
          body,
          user,
        },
        null,
        2
      )}`
    );

    return next.handle().pipe(
      tap((data) =>
        this.logger.debug(
          `RESPONSE DATA \n${safeStringify(
            {
              statusCode,
              data,
            },
            null,
            2
          )}`
        )
      )
    );
  }
}
