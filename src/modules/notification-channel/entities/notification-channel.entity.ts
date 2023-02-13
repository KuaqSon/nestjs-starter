import { ApiProperty } from '@nestjs/swagger';
import { AuditableTable } from 'src/shared/entities/auditable.entity';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

export enum NotificationChannelTypeEnum {
  SLACK = 'SLACK',
  TELEGRAM = 'TELEGRAM',
}

@Entity()
export class NotificationChannel extends AuditableTable {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'id' })
  id: string;

  @Column('enum', { default: NotificationChannelTypeEnum.SLACK, enum: NotificationChannelTypeEnum })
  type: NotificationChannelTypeEnum;

  @Column({ default: true })
  isActive: boolean;

  @Column('jsonb', { nullable: false, default: {} })
  metadata: string;
}
