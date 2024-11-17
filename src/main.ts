import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Shops From Bio')
    .setDescription('The Shops From Bio API description')
    .setVersion('1.0')
    .addTag('shopsfrombio')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory);
  await app.listen(config.port);

  console.log(`Listening on port ${config.port}`);
}
bootstrap();
