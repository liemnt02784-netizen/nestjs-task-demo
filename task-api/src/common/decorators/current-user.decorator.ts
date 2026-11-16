import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from '../../users/user.entity.js';

// Custom decorator @CurrentUser(): lấy ra người đang gọi API.
// ApiKeyGuard tìm người dùng theo chìa khóa rồi gắn vào request.user;
// decorator này chỉ việc đọc lại, để controller viết gọn: create(@CurrentUser() user)
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): User | undefined => {
  const request = ctx.switchToHttp().getRequest<{ user?: User }>();
  return request.user;
});
