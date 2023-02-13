import { ApiProperty } from '@nestjs/swagger';

export class BasePostDto {
  @ApiProperty({
    required: true,
    description: 'title',
  })
  title: string;

  @ApiProperty({
    required: false,
    description: 'content',
  })
  content: string;

  @ApiProperty({
    required: false,
    description: 'publishAt',
  })
  publishAt: Date;
}

export class PostDto extends BasePostDto {
  @ApiProperty()
  readonly id: string;
}

export class CreatePostDto extends BasePostDto {}
