import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/modules/post/entities/post.entity';
import { FindArgs, paging } from 'src/shared/dtos/common.dtos';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { FindOptionsOrder, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  private readonly logger = new Logger(PostService.name);

  async create(createPostDto: CreatePostDto) {
    const createdBy = this.httpContext.getUserId();
    await this.postRepository.save(
      this.postRepository.create({
        ...createPostDto,
        createdBy: createdBy,
      })
    );
  }

  findAll(args: FindArgs) {
    const { limit: take = 10, offset: skip = 0, order } = args;

    const orderFindOptions: FindOptionsOrder<Post> = {
      createdAt: order === 'createdAt:ASC' ? 'ASC' : 'DESC',
    };

    return paging(
      this.postRepository,
      {
        order: orderFindOptions,
        take,
        skip,
      },
      take,
      skip
    );
  }

  findOne(id: string) {
    return this.postRepository.findOneOrFail({ where: { id } });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const updatedBy = this.httpContext.getUserId();
    await this.postRepository.update(id, {
      ...updatePostDto,
      updatedBy,
    } as Post);
  }

  async remove(id: string) {
    await this.postRepository.delete(id);
  }
}
