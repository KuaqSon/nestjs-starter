import { PartialType } from '@nestjs/swagger';
import { PostDto } from 'src/modules/post/dto/create-post.dto';

export class UpdatePostDto extends PartialType(PostDto) {}
