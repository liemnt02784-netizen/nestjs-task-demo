import { IsNotEmpty, MaxLength,IsString, IsOptional, IsIn, IsDateString   } from "class-validator";
import { PRIORITIES, STATUSES, type Priority, type TaskStatus } from '../entities/task.entity.js';


export class CreateTaskDto {

@IsString()

@IsNotEmpty({message: 'Tiêu đề KHÔNG được rỗng'})
@MaxLength(100)
title: string;
@IsOptional()
@IsString()
description?: string;

// Trạng thái (cột trên bảng Kanban): todo = Cần làm, in_progress = Đang làm, done = Hoàn thành
@IsOptional()
@IsIn(STATUSES, { message: 'status chỉ nhận todo, in_progress hoặc done' })
status?: TaskStatus;

// Độ ưu tiên: low = Thấp, medium = Vừa, high = Cao
@IsOptional()
@IsIn(PRIORITIES, { message: 'priority chỉ nhận low, medium hoặc high' })
priority?: Priority;

// Hạn chót dạng YYYY-MM-DD
@IsOptional()
@IsDateString({}, { message: 'dueDate phải là ngày dạng YYYY-MM-DD' })
dueDate?: string;
}
