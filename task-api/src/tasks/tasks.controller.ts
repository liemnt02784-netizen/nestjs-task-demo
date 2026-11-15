import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, StandardSchemaValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../common/api-key/api-key.guard.js';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { taskQuerySchema, type TaskQuery } from './schemas/task-query.schema.js';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Tạo công việc mới' })
  @ApiSecurity('api-key')
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
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
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Cập nhật công việc' })
  @ApiSecurity('api-key')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Xóa công việc' })
  @ApiSecurity('api-key')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
