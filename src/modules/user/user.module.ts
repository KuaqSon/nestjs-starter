import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/modules/user/user.controller';
import { User } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
