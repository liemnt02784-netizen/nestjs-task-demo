import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import type { Role, User } from '../../users/user.entity.js';

// RolesGuard: "bảo vệ đọc biển". Chạy SAU ApiKeyGuard (đã biết bạn là ai).
@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector: "kính lúp" đọc metadata mà @Roles(...) đã dán lên route
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Route cần những vai trò nào? (đọc trên hàm trước, không có thì đọc trên cả class)
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!roles) return true; // route không dán @Roles → ai đã đăng nhập cũng được

    const user = context.switchToHttp().getRequest<{ user?: User }>().user; // ApiKeyGuard đã gắn

    if (user && roles.includes(user.role)) return true; // vai trò nằm trong danh sách → cho qua

    // 403: biết bạn là ai rồi, nhưng vai trò không đủ quyền
    throw new ForbiddenException('Vai trò của bạn không được phép thực hiện hành động này.');
  }
}
