import * as dotenv from 'dotenv';
dotenv.config();
import { BaseExceptionFilter, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { coreConfig } from 'config/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { connectToDatabase } from './mongodb';

async function bootstrap() {
  await connectToDatabase();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.use(json({ limit: '1mb' }));
  // app.use(urlencoded({ extended: true }));
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
  await app.listen(coreConfig.port);
  console.log(`http://${coreConfig.host}:${coreConfig.port}`);
}

bootstrap();
