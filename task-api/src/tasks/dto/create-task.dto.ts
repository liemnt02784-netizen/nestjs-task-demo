import { IsNotEmpty, MaxLength,IsString, IsOptional   } from "class-validator";


export class CreateTaskDto {

@IsString()

@IsNotEmpty({message: 'Tiêu đề KHÔNG được rỗng'})
@MaxLength(100) 
title: string;
@IsOptional()
@IsString()
description?: string;
}
