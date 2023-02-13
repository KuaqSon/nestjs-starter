import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRoleEnum } from 'src/roles/roles.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsNotEmpty()
  roles: UserRoleEnum[];

  @IsOptional()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsBoolean()
  isConfirm: boolean;
}
