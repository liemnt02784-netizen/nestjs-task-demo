import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import{ValidationPipe} from '@nestjs/common';
import { LoggingInterceptor } from './common/logging/logging.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CORS: cho trang giao diện (task-ui, chạy ở địa chỉ khác) được gọi API này.
  // exposedHeaders: cho JavaScript ở trình duyệt đọc được header X-Response-Time.
  app.enableCors({ exposedHeaders: ['X-Response-Time'] });
  app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,errorFormat: 'grouped',}));
  app.useGlobalInterceptors(new LoggingInterceptor());
  const config = new DocumentBuilder()
  .setTitle('Task API')
  .setDescription('API quản lý công việc - demo nhóm NestJS, Đại học Hoa Sen')
  .setVersion('1.0')
  .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
