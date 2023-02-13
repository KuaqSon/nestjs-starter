import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/roles/roles.enum';

export class BaseUserResDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  roles: UserRoleEnum[];
}

export class UserResDto extends BaseUserResDto {
  @ApiProperty()
  readonly id: string;
}
