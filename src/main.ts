import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { coreConfig } from 'config/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix(coreConfig.restApiPrefix);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      forbidNonWhitelisted: false,
      transform: true,
      whitelist: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('File Server')
    .setDescription('File Server API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(coreConfig.port);
  console.log(
    `Api Documentation: http://${coreConfig.host}:${coreConfig.port}/api`,
  );
}

bootstrap();
