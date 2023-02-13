import type { PipeTransform } from '@nestjs/common';
import { applyDecorators, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PublicRoute } from 'src/decorators/public-route.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { UserRoleEnum } from 'src/roles/roles.enum';

export function Auth(roles: UserRoleEnum[] = [], options?: Partial<{ public: boolean }>): MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard({ public: isPublicRoute }), RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    PublicRoute(isPublicRoute)
  );
}

export function UUIDParam(property: string, ...pipes: Array<Type<PipeTransform> | PipeTransform>): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
