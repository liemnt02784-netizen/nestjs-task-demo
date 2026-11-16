import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TasksModule } from './tasks/tasks.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ActivityModule } from './activity/activity.module.js';
import { Task } from './tasks/entities/task.entity.js';
import { Activity } from './activity/activity.entity.js';
import { User } from './users/user.entity.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    // Kết nối database SQLite: toàn bộ dữ liệu nằm trong một file tasks.sqlite ở thư mục dự án.
    // Dùng driver sql.js (viết bằng JavaScript/WebAssembly) nên không phải cài phần mềm database nào.
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: 'tasks.sqlite', // file lưu dữ liệu
      autoSave: true, // mỗi lần ghi thì lưu xuống file luôn → tắt server không mất dữ liệu
      entities: [Task, Activity, User], // các bảng
      synchronize: true, // tự tạo/sửa bảng theo class Entity (chỉ dùng khi học/demo, dự án thật dùng migration)
    }),
    UsersModule,
    TasksModule,
    AuthModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
