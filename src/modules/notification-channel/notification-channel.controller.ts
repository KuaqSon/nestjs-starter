import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { NotificationChannelService } from './notification-channel.service';
import { CreateNotificationChannelDto } from './dto/create-notification-channel.dto';
import { UpdateNotificationChannelDto } from './dto/update-notification-channel.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginateNotificationChannelDto } from 'src/modules/notification-channel/dto/paginate-notification-channel.dto';
import { FindArgs } from 'src/shared/dtos/common.dtos';
import { Auth } from 'src/decorators/http.decorators';
import { UserRoleEnum } from 'src/roles/roles.enum';
import { SentryInterceptor } from 'src/interceptor/sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Controller('notification-channel')
@ApiTags('notification-channel')
export class NotificationChannelController {
  constructor(private readonly notificationChannelService: NotificationChannelService) {}

  @Post()
  @Auth([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER])
  create(@Body() createNotificationChannelDto: CreateNotificationChannelDto) {
    return this.notificationChannelService.create(createNotificationChannelDto);
  }

  @Get()
  @Auth([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER])
  findAll(@Query() args: FindArgs): Promise<PaginateNotificationChannelDto> {
    return this.notificationChannelService.findAll(args);
  }

  @Get(':id')
  @Auth([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER])
  findOne(@Param('id') id: string) {
    return this.notificationChannelService.findOne(id);
  }

  @Patch(':id')
  @Auth([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER])
  update(@Param('id') id: string, @Body() updateNotificationChannelDto: UpdateNotificationChannelDto) {
    return this.notificationChannelService.update(id, updateNotificationChannelDto);
  }

  @Delete(':id')
  @Auth([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER])
  remove(@Param('id') id: string) {
    return this.notificationChannelService.remove(id);
  }
}
