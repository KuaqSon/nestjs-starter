import { BaseEntity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AuditableTable extends BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;
}
