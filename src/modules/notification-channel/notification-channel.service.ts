import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IncomingWebhook } from '@slack/webhook';
import { Queue } from 'bull';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const XMLHttpRequest = require('xhr2');

import {
  NotificationChannelEntity,
  NotificationChannelTypeEnum,
} from 'src/modules/notification-channel/entities/notification-channel.entity';
import { UserEntity } from 'src/modules/user/user.entity';

import { FindArgs, paging } from 'src/shared/dtos/common.dtos';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { FindOptionsOrder, Repository } from 'typeorm';
import { CreateNotificationChannelDto } from './dto/create-notification-channel.dto';
import { UpdateNotificationChannelDto } from './dto/update-notification-channel.dto';

@Injectable()
export class NotificationChannelService {
  constructor(
    @InjectRepository(NotificationChannelEntity)
    private notificationChannelRepository: Repository<NotificationChannelEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectQueue('notification-channel') private readonly notificationQueue: Queue,
    private readonly httpContext: HttpRequestContextService
  ) {}

  private readonly logger = new Logger(NotificationChannelService.name);

  async create(createNotificationChannelDto: CreateNotificationChannelDto) {
    const user = this.httpContext.getUser();
    await this.notificationChannelRepository.save(
      this.notificationChannelRepository.create({
        ...createNotificationChannelDto,
        type: NotificationChannelTypeEnum[createNotificationChannelDto.type],
        createdBy: user?.id,
      })
    );
  }

  findAll(args: FindArgs) {
    const { limit: take = 10, offset: skip = 0, order } = args;

    const orderFindOptions: FindOptionsOrder<NotificationChannelEntity> = {
      createdAt: order === 'createdAt:ASC' ? 'ASC' : 'DESC',
    };

    return paging(
      this.notificationChannelRepository,
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
    return this.notificationChannelRepository.findOneOrFail({ where: { id } });
  }

  async update(id: string, updateNotificationChannelDto: UpdateNotificationChannelDto) {
    const user = this.httpContext.getUser();
    await this.notificationChannelRepository.update(id, {
      ...updateNotificationChannelDto,
      updatedBy: user?.id,
    } as NotificationChannelEntity);
  }

  async remove(id: string) {
    await this.notificationChannelRepository.delete(id);
  }

  async queuePushMessage(text: string) {
    await this.notificationQueue.add('push-message-to-all-channels', {
      text,
    });
  }

  async pushMessageToAllChannels(text: string) {
    const notificationChannels = await this.notificationChannelRepository.find({ where: { isActive: true } });
    for (const notificationChannel of notificationChannels) {
      switch (notificationChannel.type) {
        case NotificationChannelTypeEnum.SLACK:
          await this.pushMessageToSlack(notificationChannel, text);
          break;
        case NotificationChannelTypeEnum.TELEGRAM:
          await this.pushMessageToTelegram(notificationChannel, text);
          break;
      }
    }
  }

  async pushMessageToSlack(notificationChannel: NotificationChannelEntity, text: string): Promise<void> {
    const { webhooks } = notificationChannel.metadata as any;
    if (!webhooks) {
      return;
    }

    const webhook = new IncomingWebhook(webhooks);
    await webhook.send({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text,
          },
        },
      ],
    });
  }

  async pushMessageToTelegram(notificationChannel: NotificationChannelEntity, text: string): Promise<void> {
    const { apiToken, chatId } = notificationChannel.metadata as any;
    if (!apiToken || !chatId) {
      return;
    }

    const urlString = `https://api.telegram.org/bot${apiToken}/sendMessage?chat_id=${chatId}&text=${text}`;
    const request = new XMLHttpRequest();
    request.open('GET', urlString);
    await request.send();
  }
}
