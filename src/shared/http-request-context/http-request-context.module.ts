import { Global, Module } from '@nestjs/common';
import { HttRequestContextMiddleware } from 'src/shared/http-request-context/http-request-context.middleware';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';

@Global()
@Module({
  providers: [HttpRequestContextService, HttRequestContextMiddleware],
  exports: [HttpRequestContextService, HttRequestContextMiddleware],
})
export class HttRequestContextModule {}
