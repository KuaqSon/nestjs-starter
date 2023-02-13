import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from 'src/roles/roles.enum';

export const Roles = (...roles: UserRoleEnum[]) => SetMetadata('roles', roles);
