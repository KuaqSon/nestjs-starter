import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/roles/roles.enum';
import { PostEntity } from 'src/modules/post/entities/post.entity';

@Entity({
  name: 'User',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'userID' })
  id: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'email' })
  email: string;

  @Column()
  @ApiProperty({ description: 'password' })
  password: string;

  @Column()
  @ApiProperty({ description: 'full name' })
  fullName: string;

  @Column('text', { array: true, default: ['USER'] })
  @ApiProperty({ description: 'roles' })
  roles: UserRoleEnum[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isConfirm: boolean;

  @OneToMany(() => PostEntity, (post) => post.id)
  @JoinColumn()
  posts: PostEntity[];
}
