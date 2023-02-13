import { ApiProperty } from '@nestjs/swagger';
import { NotificationChannelDto } from 'src/modules/notification-channel/dto/create-notification-channel.dto';
import { PaginationResult } from 'src/shared/dtos/common.dtos';

export class PaginateNotificationChannelDto extends PaginationResult<NotificationChannelDto> {
  @ApiProperty({
    required: true,
    type: [NotificationChannelDto],
  })
  items: NotificationChannelDto[];
}
