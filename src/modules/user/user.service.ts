import { ConflictException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { UserEntity } from 'src/modules/user/user.entity';
import { PaginationResult, genPaginationResult } from 'src/shared/dtos/common.dtos';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { UserFindArgs } from 'src/modules/user/dto/user-find-args.dto';
import { UserChangePassDto } from 'src/modules/user/dto/change-pass-user.dto';
import { UpdateProfileDto } from 'src/modules/user/dto/update-profile.dto';
import { UserRoleEnum } from 'src/roles/roles.enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.save(this.usersRepository.create(createUserDto));
  }

  async findOne(fields: EntityCondition<UserEntity>): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: fields,
    });
  }

  async getAllUser(args: UserFindArgs): Promise<PaginationResult<UserEntity>> {
    const { limit, offset, q, roles, isActive, order } = args;
    const userId = this.httpContext.getUser().id;

    const record = this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.fullName', 'user.email', 'user.roles', 'user.isActive', 'user.createdAt'])
      .where('user.id != :userId', { userId });

    if (q) {
      record.andWhere('LOWER(CONCAT(user.fullName, user.email)) ILIKE LOWER(:keyword)', {
        keyword: `%${q}%`,
      });
    }

    if (roles) {
      record.andWhere(':roles = ANY(user.roles)', { roles: roles });
    }

    if (typeof isActive === 'boolean') {
      record.andWhere('user.isActive = :isActive', { isActive });
    }

    if (order && order === 'createdAt:ASC') {
      record.orderBy('user.createdAt', 'ASC');
    } else {
      record.orderBy('user.createdAt', 'DESC');
    }

    const [items, count] = await record
      .limit(limit || 10)
      .offset(offset || 0)
      .getManyAndCount();

    return genPaginationResult(items, count, args.offset, args.limit);
  }

  async add(userDto: CreateUserDto): Promise<void> {
    const currentUserRoles = this.httpContext.getUser()?.roles || [];
    const { email, fullName, roles, password } = userDto;

    const existed = await this.usersRepository.findOneBy({ email });
    if (existed) {
      throw new ConflictException('This email is already associated with an account');
    }

    if (currentUserRoles.includes(UserRoleEnum.MANAGER) && roles.includes(UserRoleEnum.ADMIN)) {
      throw new ForbiddenException();
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      fullName,
      roles,
    });

    await this.usersRepository.save(user);
  }

  async update(userId: string, userDto: UpdateUserDto): Promise<void> {
    const currentUserRoles = this.httpContext.getUser()?.roles || [];
    const roles = userDto.roles;
    if (currentUserRoles.includes(UserRoleEnum.MANAGER) && roles?.includes(UserRoleEnum.ADMIN)) {
      throw new ForbiddenException();
    }
    await this.usersRepository.update(userId, userDto);
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async changePassword(userChangePassDto: UserChangePassDto): Promise<void> {
    const { oldPassword, newPassword } = userChangePassDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const currentUser = this.httpContext.getUser();
    const user = await this.findOne({ email: currentUser.email });
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);

    if (isValidPassword && newPassword !== oldPassword)
      await this.usersRepository.update(currentUser.id, { password: hashedPassword });
    else {
      throw new ConflictException();
    }
  }

  async updateProfile(updateProfileDto: UpdateProfileDto): Promise<void> {
    const currentUser = this.httpContext.getUser();
    await this.usersRepository.update(currentUser.id, updateProfileDto);
  }
}
