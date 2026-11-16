import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import{ValidationPipe} from '@nestjs/common';
import { LoggingInterceptor } from './common/logging/logging.interceptor.js';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { HttpErrorFilter } from './common/filters/http-error.filter.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Cho xem file đã upload: thư mục uploads/ được phục vụ ở địa chỉ /uploads/...
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });
  // CORS: cho trang giao diện (task-ui, chạy ở địa chỉ khác) được gọi API này.
  // exposedHeaders: cho JavaScript ở trình duyệt đọc được header X-Response-Time.
  app.enableCors({ exposedHeaders: ['X-Response-Time'] });
  app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,errorFormat: 'grouped',}));
  app.useGlobalInterceptors(new LoggingInterceptor());
  // Exception Filter cho toàn bộ ứng dụng: lỗi nào cũng trả về cùng một khuôn, có tiếng Việt, path, timestamp
  app.useGlobalFilters(new HttpErrorFilter());
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
