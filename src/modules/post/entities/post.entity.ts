import { User } from 'src/modules/user/user.entity';
import { AuditableTable } from 'src/shared/entities/auditable.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post extends AuditableTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'timestamptz', nullable: false })
  publishAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;
}
