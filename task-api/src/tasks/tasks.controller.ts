import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, StandardSchemaValidationPipe, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../common/api-key/api-key.guard.js';
import { ApiTags, ApiOperation, ApiSecurity, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { taskQuerySchema, type TaskQuery } from './schemas/task-query.schema.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { User } from '../users/user.entity.js';
import { uploadOptions } from './upload.config.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/roles/roles.guard.js';
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Phân quyền: @UseGuards(ApiKeyGuard, RolesGuard) chạy theo thứ tự từ trái sang phải.
  //   ApiKeyGuard: bạn là ai? (401)  →  RolesGuard: vai trò của bạn có trong @Roles không? (403)
  //   POST /tasks: ai đăng nhập cũng được · PATCH + attachment: admin, editor · DELETE: chỉ admin

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Tạo công việc mới' })
  @ApiSecurity('api-key')
  // @CurrentUser(): custom decorator lấy người đang đăng nhập, để ghi "ai tạo"
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user?: User) {
    return this.tasksService.create(createTaskDto, user?.name);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách công việc' })
  findAll(@Query({ schema: taskQuerySchema, pipes: [StandardSchemaValidationPipe] }) query: TaskQuery) {
  return this.tasksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết công việc' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard,RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Cập nhật công việc' })
  @ApiSecurity('api-key')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  // POST /tasks/:id/attachment: đính kèm 1 file (ảnh hoặc PDF, tối đa 2 MB)
  // FileInterceptor('file') chạy TRƯỚC controller: đọc phần "file" trong form gửi lên,
  // lưu xuống thư mục uploads/ rồi GẮN vào request (request.file).
  // @UploadedFile() lấy lại đúng file đó để truyền cho service.
  
  @Post(':id/attachment')
  @UseGuards(ApiKeyGuard,RolesGuard)
  @Roles('admin', 'editor')
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  @ApiOperation({ summary: 'Đính kèm file (ảnh hoặc PDF, tối đa 2 MB)' })
  @ApiSecurity('api-key')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  attach(@Param('id', ParseIntPipe) id: number, @UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Chưa chọn file (field tên "file")', { errorCode: 'FILE_REQUIRED' });
    }
    return this.tasksService.attach(id, file);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard,RolesGuard)
  
  @Roles('admin')
  @ApiOperation({ summary: 'Xóa công việc' })
  @ApiSecurity('api-key')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
