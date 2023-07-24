import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import commonConfig from './config/common.config';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Merchify API')
    .setDescription('Merchify NestJS API')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // CORS setup
  const allowedUrls = commonConfig.allowedOrigins.split(',');
  const corsOptions = {
    origin: allowedUrls,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
  app.enableCors(corsOptions);
  app.use(json({ limit: '1024mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );
  const server = await app.listen(commonConfig.port);
  server.setTimeout(3600000);
}

bootstrap();
