import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './entities/task.entity.js';
 import type { TaskQuery } from './schemas/task-query.schema.js';

@Injectable()
export class TasksService {
 private tasks: Task[] = [];
private nextId = 1;

  create(createTaskDto: CreateTaskDto) {
    const id = this.nextId++;
    const title = createTaskDto.title;
    const description = createTaskDto.description;
    const done = false;
    const createdAt = new Date();
    const task: Task = { id, title, description, done, createdAt   };
    this.tasks.push(task);
    return task;
  }

  findAll(query: TaskQuery = {}) {
    return this.tasks.filter((t) => {
      // Điều kiện 1: kiểm tra trường done
      const doneCondition = query.done === undefined || t.done === query.done;
      // Điều kiện 2: kiểm tra trường q
      const qCondition = query.q === undefined || t.title.toLowerCase().includes(query.q.toLowerCase());
      return doneCondition && qCondition;
    });
  }

  findOne(id: number) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      return task;
    } else {
      throw new NotFoundException('Không tìm thấy công việc #' + id, { errorCode: 'TASK_NOT_FOUND' });
      
    }
    
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    const  task = this.findOne(id);
    Object.assign(task, updateTaskDto);
    return task;
   
  }

  remove(id: number) {
    const  task = this.findOne(id);
    const remainingTasks = this.tasks.filter(t => t.id !== id);
    this.tasks = remainingTasks;
    return task;
  
  }
}
