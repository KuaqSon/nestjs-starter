import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from 'src/app.module';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor';

import * as Sentry from '@sentry/node';
import '@sentry/tracing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);

  app.enableShutdownHooks();

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.useLogger(app.get(Logger));

  const isProduction = configService.get('nodeEnv') === 'production';

  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Nest Tool')
      .setDescription('nest API description')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  app.enableCors({ allowedHeaders: '*', origin: '*', credentials: true });

  Sentry.init({
    dsn: configService.get('sentryDsn'),
    tracesSampleRate: 1.0,
    environment: configService.get('nodeEnv'),
  });

  await app.listen(configService.get('port'), () => {
    console.log(`\n🚀 App running on http://localhost:${configService.get('port')}`);
    if (!isProduction) {
      console.log(`\n🚀 Swagger running on http://localhost:${configService.get('port')}/api-docs\n`);
    }
  });
}
bootstrap().catch((e) => console.log(`\n🚀 Failed to start Application due to ->>\n${e}`));
