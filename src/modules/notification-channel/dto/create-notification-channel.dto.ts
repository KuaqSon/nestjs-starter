import { ApiProperty } from '@nestjs/swagger';

export class BaseNotificationChannelDto {
  @ApiProperty({
    required: true,
    description: 'type',
  })
  type: string;

  @ApiProperty({
    required: false,
    description: 'Is active state',
  })
  isActive: boolean;

  @ApiProperty({
    required: false,
    description: 'metadata',
  })
  metadata?: string;
}

export class NotificationChannelDto extends BaseNotificationChannelDto {
  @ApiProperty()
  readonly id: string;
}

export class CreateNotificationChannelDto extends BaseNotificationChannelDto {}
