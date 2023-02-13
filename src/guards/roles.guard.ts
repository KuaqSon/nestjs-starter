import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from 'src/roles/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    return requireRoles.some((role) => request?.user?.roles?.includes(role));
  }
}
