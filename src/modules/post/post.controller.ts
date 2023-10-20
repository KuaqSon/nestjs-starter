import { Controller, Get, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Auth, UUIDParam } from 'src/decorators/http.decorators';
import { UserRoleEnum } from 'src/roles/roles.enum';
import { FindArgs } from 'src/shared/dtos/common.dtos';
import { ApiTags } from '@nestjs/swagger';

@Controller('post')
@ApiTags('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Auth([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER])
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @Auth([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER])
  findAll(@Query() args: FindArgs) {
    return this.postService.findAll(args);
  }

  @Get(':id')
  @Auth([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER])
  findOne(@UUIDParam('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @Auth([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER])
  update(@UUIDParam('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @Auth([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER])
  remove(@UUIDParam('id') id: string) {
    return this.postService.remove(id);
  }
}
