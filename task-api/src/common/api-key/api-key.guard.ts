import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../../users/users.service.js';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  // Nest tự tiêm UsersService (đọc bảng users trong database)
  constructor(private readonly users: UsersService) {}

  // async vì phải chờ database trả kết quả
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('Thiếu chìa khóa API');   // 401: chưa gửi chìa khóa
    }

    const user = await this.users.findByApiKey(apiKey);  // tìm trong database

    if (!user) { // 401: chìa khóa không thuộc về ai
      throw new UnauthorizedException('Chìa khóa không hợp lệ');
    }

    (request as any).user = user;  // gắn người dùng vào request cho @CurrentUser, RolesGuard, AuditInterceptor dùng
    return true;
  }
}
