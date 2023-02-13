import { Injectable, Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { NextFunction, Request, Response } from 'express';
import { CurrentUser } from 'src/modules/auth/current-user';
import { UserRoleEnum } from 'src/roles/roles.enum';
import { HEADER } from 'src/shared/constant/request';

export class HttpRequestContext {
  constructor(public requestId?: string, public user?: CurrentUser, public systemId?: string) {}
}

@Injectable()
export class HttpRequestContextService {
  private static asyncLocalStorage = new AsyncLocalStorage<HttpRequestContext>();

  private readonly logger = new Logger(HttpRequestContextService.name);

  runWithContext(req: Request, _res: Response, next: NextFunction) {
    const context = new HttpRequestContext();
    context.requestId = req.headers[HEADER.X_REQUEST_ID] as string;
    this.logger.debug(`----- Run with context %j`, context);
    HttpRequestContextService.asyncLocalStorage.run(context, () => {
      next();
    });
  }

  getRequestId() {
    const reqContext = HttpRequestContextService.asyncLocalStorage.getStore();

    return reqContext?.requestId;
  }

  setRequestId(id: string) {
    const reqContext = HttpRequestContextService.asyncLocalStorage.getStore();

    reqContext.requestId = id;
  }

  getUser() {
    const reqContext = HttpRequestContextService.asyncLocalStorage.getStore();

    this.logger.debug(`Context is %j`, reqContext);

    return reqContext?.user;
  }

  setUser(user: CurrentUser) {
    const reqContext = HttpRequestContextService.asyncLocalStorage.getStore();

    this.logger.debug(`-----Context BEFORE is %j`, reqContext);

    reqContext.user = user;

    this.logger.debug(`-----Context AFTER is %j`, reqContext);
  }

  isModerator(): boolean {
    const reqContext = HttpRequestContextService.asyncLocalStorage.getStore();
    const currentUserRoles = reqContext?.user?.roles || [];
    return currentUserRoles.includes(UserRoleEnum.MANAGER) || currentUserRoles.includes(UserRoleEnum.ADMIN);
  }

  getUserId(): string | undefined {
    const currentUser = this.getUser();
    return currentUser?.id;
  }
}
