import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bull';
import { NotificationChannel } from 'src/modules/notification-channel/entities/notification-channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationChannelController } from 'src/modules/notification-channel/notification-channel.controller';
import { NotificationChannelService } from 'src/modules/notification-channel/notification-channel.service';
import { User } from 'src/modules/user/user.entity';
import { NotificationProcessor } from 'src/modules/notification-channel/notification-channel.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationChannel, User]),
    BullModule.registerQueue({
      name: 'notification-channel',
    }),
  ],
  controllers: [NotificationChannelController],
  providers: [NotificationChannelService, NotificationProcessor],
  exports: [NotificationChannelService],
})
export class NotificationChannelModule {}
