import { BadRequestException, ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError, useContainer } from 'class-validator';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from 'src/app.module';

import * as Sentry from '@sentry/node';
import '@sentry/tracing';
import { SentryFilter } from 'src/utils/exceptions/sentry.filter';
import { AspectLoggerInterceptor } from 'src/interceptor/aspect-logger.interceptor';
import { AllExceptionsFilter } from 'src/utils/exceptions/all-exceptions-filter';
import { ResponseInterceptor } from 'src/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.enableShutdownHooks();

  app.useLogger(app.get(Logger));

  app.useGlobalFilters(new SentryFilter(httpAdapterHost.httpAdapter));
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalInterceptors(new AspectLoggerInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) =>
        new BadRequestException(validationErrors.map((error) => Object.values(error.constraints).join(', '))),
    })
  );

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
