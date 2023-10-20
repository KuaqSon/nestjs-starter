import { ArgumentsHost, Catch, HttpServer, Logger } from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(SentryFilter.name);

  handleUnknownError(
    exception: unknown,
    host: ArgumentsHost,
    applicationRef: HttpServer<any, any> | AbstractHttpAdapter<any, any, any>
  ): void {
    console.log('🚀 ~ file: sentry.filter.ts:15 ~ exception:', exception);
    Sentry.captureException(exception);
    super.handleUnknownError(exception, host, applicationRef);
  }
}
