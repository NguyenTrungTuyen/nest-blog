import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  // Bật tự động validate DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // bỏ các field không khai báo trong DTO
      forbidNonWhitelisted: true, // lỗi nếu có field dư
      transform: true, // tự chuyển kiểu (ví dụ: page=1 -> number)
    }),
  );

  const config = new DocumentBuilder()
  .setTitle('API tài liệu')            // Tiêu đề
  .setDescription('Tài liệu API cho dự án NestJS') // Mô tả
  .setVersion('1.0')                   // Version
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    in: 'header',}, 'jwt')   
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Đường dẫn: /swagger
  // app.setGlobalPrefix('api/v1', { exclude: ['']}); // Xét tiền tố, trừ route gốc /.

  await app.listen(port);
  console.log(`API Server is running on:http://localhost:${port}/Api`);
    console.log ("PORT:", configService.get<number>('PORT'));
  console.log ("DB:",configService.get<string>('MONGODB_URI'));
  
}
bootstrap();
