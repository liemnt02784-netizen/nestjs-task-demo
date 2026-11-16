import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, type FindOptionsWhere } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './entities/task.entity.js';
import type { TaskQuery } from './schemas/task-query.schema.js';

@Injectable()
export class TasksService {
  // Trước đây: private tasks: Task[] = [] (mảng trong bộ nhớ, tắt server là mất).
  // Bây giờ: Repository<Task> = "người quản lý bảng tasks" do TypeORM tạo, được Nest TIÊM vào (DI).
  // Các hàm đều là async vì đọc/ghi database cần thời gian.
  constructor(@InjectRepository(Task) private readonly repo: Repository<Task>) {}

  create(createTaskDto: CreateTaskDto, createdBy?: string) {
    const status = createTaskDto.status ?? 'todo';
    const task = this.repo.create({ ...createTaskDto, status, done: status === 'done', createdBy });
    return this.repo.save(task); // INSERT INTO tasks ...
  }

  findAll(query: TaskQuery = {}) {
    const where: FindOptionsWhere<Task> = {};
    if (query.done !== undefined) where.done = query.done; // WHERE done = ?
    if (query.q !== undefined) where.title = Like(`%${query.q}%`); // AND title LIKE '%từ khóa%'
    return this.repo.find({ where, order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const task = await this.repo.findOneBy({ id }); // SELECT * FROM tasks WHERE id = ?
    if (!task) {
      throw new NotFoundException('Không tìm thấy công việc #' + id, { errorCode: 'TASK_NOT_FOUND' });
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id); // vẫn gọi findOne để báo 404 ở một chỗ
    Object.assign(task, updateTaskDto);
    // Giữ done và status luôn khớp nhau (kéo thẻ sang cột khác hoặc bấm ✓ đều được)
    if (updateTaskDto.status !== undefined) task.done = updateTaskDto.status === 'done';
    else if (updateTaskDto.done !== undefined) task.status = updateTaskDto.done ? 'done' : 'todo';
    return this.repo.save(task); // UPDATE tasks SET ...
  }

  // Gắn file vừa upload vào công việc. FileInterceptor đã lưu file xuống ổ đĩa,
  // ở đây chỉ ghi lại thông tin vào database để giao diện hiển thị.
  async attach(id: number, file: Express.Multer.File) {
    const task = await this.findOne(id);
    task.attachment = {
      originalName: file.originalname,
      url: '/uploads/' + file.filename,
      mimetype: file.mimetype,
      size: file.size,
    };
    return this.repo.save(task);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    await this.repo.delete(id); // DELETE FROM tasks WHERE id = ?
    return task; // trả lại task vừa xóa (như trước)
  }
}
