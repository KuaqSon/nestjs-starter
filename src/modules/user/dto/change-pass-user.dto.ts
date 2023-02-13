import { ApiProperty } from '@nestjs/swagger';
import { Matches, MaxLength, MinLength } from 'class-validator';

export class UserChangePassDto {
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'old password is too weak',
  })
  @ApiProperty()
  oldPassword: string;

  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'new password is too weak',
  })
  @ApiProperty()
  newPassword: string;
}
