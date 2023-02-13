import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { NotificationChannelService } from 'src/modules/notification-channel/notification-channel.service';

@Processor('notification-channel')
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly notificationChannelService: NotificationChannelService) {}

  @Process('push-message-to-all-channels')
  async handleSendSlackNotification(job: Job) {
    await this.notificationChannelService.pushMessageToAllChannels(job.data.text);
  }
}
