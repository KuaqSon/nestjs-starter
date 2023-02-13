import { ApiProperty } from '@nestjs/swagger';
import { UserResDto } from 'src/modules/user/dto/user-res.dto';
import { PaginationResult } from 'src/shared/dtos/common.dtos';

export class PaginateUserDto extends PaginationResult<UserResDto> {
  @ApiProperty({
    required: true,
    type: [UserResDto],
  })
  items: UserResDto[];
}
