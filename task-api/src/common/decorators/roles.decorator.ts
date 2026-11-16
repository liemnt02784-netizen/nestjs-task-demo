import { SetMetadata } from '@nestjs/common';
import type { Role } from '../../users/user.entity.js';

export const ROLES_KEY = 'roles';

// Custom decorator @Roles(...): "dán biển" lên route, ghi route đó cho vai trò nào gọi.
// Ví dụ @Roles('admin', 'editor') → gắn metadata roles = ['admin', 'editor'].
// Decorator này KHÔNG tự chặn ai; RolesGuard đọc biển này rồi mới quyết định cho qua hay 403.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
