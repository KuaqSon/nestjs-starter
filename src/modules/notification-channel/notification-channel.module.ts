import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bull';
import { NotificationChannelEntity } from 'src/modules/notification-channel/entities/notification-channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationChannelController } from 'src/modules/notification-channel/notification-channel.controller';
import { NotificationChannelService } from 'src/modules/notification-channel/notification-channel.service';
import { UserEntity } from 'src/modules/user/user.entity';
import { NotificationProcessor } from 'src/modules/notification-channel/notification-channel.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationChannelEntity, UserEntity]),
    BullModule.registerQueue({
      name: 'notification-channel',
      limiter: {
        max: 20,
        duration: 1000,
      },
      defaultJobOptions: {
        removeOnComplete: {
          age: 172800, // 2 days
        },
      },
    }),
  ],
  controllers: [NotificationChannelController],
  providers: [NotificationChannelService, NotificationProcessor],
  exports: [NotificationChannelService],
})
export class NotificationChannelModule {}
