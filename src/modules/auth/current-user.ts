import { UserRoleEnum } from 'src/roles/roles.enum';

export class CurrentUser {
  id: string;
  email: string;
  fullName: string;
  roles: UserRoleEnum[];
}
