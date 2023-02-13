import { ApiProperty } from '@nestjs/swagger';
import { PostDto } from 'src/modules/post/dto/create-post.dto';
import { PaginationResult } from 'src/shared/dtos/common.dtos';

export class PaginatePostDto extends PaginationResult<PostDto> {
  @ApiProperty({
    required: true,
    type: [PostDto],
  })
  items: PostDto[];
}
