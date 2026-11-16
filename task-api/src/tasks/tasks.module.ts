import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service.js';
import { TasksController } from './tasks.controller.js';
import { Task } from './entities/task.entity.js';

@Module({
  // forFeature([Task]): cho module này dùng bảng tasks → Nest tạo sẵn Repository<Task> để tiêm vào service
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
