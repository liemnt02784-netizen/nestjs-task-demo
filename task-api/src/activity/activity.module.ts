import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './activity.entity.js';
import { ActivityController } from './activity.controller.js';
import { ActivityService } from './activity.service.js';
import { AuditInterceptor } from './audit.interceptor.js';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [ActivityController],
  providers: [
    ActivityService,
    // Đăng ký AuditInterceptor cho TOÀN BỘ ứng dụng.
    // Khác app.useGlobalInterceptors(new ...) trong main.ts: cách này để Nest tự tạo
    // interceptor, nên tiêm (DI) được ActivityService vào constructor.
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class ActivityModule {}
