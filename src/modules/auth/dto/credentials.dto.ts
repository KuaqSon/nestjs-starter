import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/roles/roles.enum';

export class CreateCredentialDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  roles: UserRoleEnum[];
}

export class AuthCredentialsDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}
