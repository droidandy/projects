import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import Helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { EntityNotFoundExceptionFilter } from './filters/entity-not-found-exception.filter';

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);

  /* SECURITY */
  app.use(Helmet());
  // USE CONFIG
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10000, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later',
    }),
  );
  const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 30, // start blocking after 3 requests
    message:
      'Too many accounts created from this IP, please try again after an hour',
  });
  app.use('/email/register', createAccountLimiter);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  // app.useGlobalFilters(new EntityNotFoundExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      // exceptionFactory: (validationErrors: ValidationError[] = []) => {
      //   return new BadRequestException(validationErrors);
      // },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Driverfly API')
    .setDescription('Driverfly API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get<string>('PORT') || 3000);
}
bootstrap();
