import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { HEADER } from 'src/shared/constant/request';

import { v4 } from 'uuid';

@Injectable()
export class RequestIdHeaderMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestIdHeaderMiddleware.name);

  use(req: Request, _res: Response, next: NextFunction) {
    req.headers[HEADER.X_REQUEST_ID] = req.headers[HEADER.X_REQUEST_ID] || v4();
    next();
  }
}
