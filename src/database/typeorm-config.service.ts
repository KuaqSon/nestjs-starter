import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('db.type'),
      host: this.configService.get('db.host'),
      port: this.configService.get('db.port'),
      schema: 'public',
      username: this.configService.get('db.username'),
      password: this.configService.get('db.password'),
      database: this.configService.get('db.name'),
      synchronize: false,
      dropSchema: false,
      logging: this.configService.get('app.nodeEnv') !== 'production',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/db/migrations',
        subscribersDir: 'subscriber',
      },
      extra: {
        // based on https://node-postgres.com/api/pool
        // max connection pool size
        max: this.configService.get('db.maxConnections'),
        ssl: this.configService.get('db.sslEnabled')
          ? {
              rejectUnauthorized: this.configService.get('db.rejectUnauthorized'),
            }
          : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
