import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Lấy PORT từ biến môi trường
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Bật ValidationPipe để kiểm tra dữ liệu đầu vào của API
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
