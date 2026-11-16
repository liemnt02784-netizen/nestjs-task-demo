import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request } from 'express';
import type { User } from '../users/user.entity.js';
import { ActivityService } from './activity.service.js';

// AuditInterceptor: tự ghi "ai đã làm gì" cho mọi request thay đổi dữ liệu.
// - Chạy SAU Guard, nên đọc được request.user mà ApiKeyGuard đã gắn vào.
// - Dùng tap: chỉ ghi khi controller chạy THÀNH CÔNG (bị 401/403/404 thì không ghi).
// - Không cần sửa controller nào: đăng ký một lần trong ActivityModule (APP_INTERCEPTOR).
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly activity: ActivityService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request & { user?: User; file?: Express.Multer.File }>();

    // GET chỉ đọc dữ liệu, không cần ghi nhật ký
    if (req.method === 'GET') return next.handle();

    return next.handle().pipe(
      tap((data: any) => {
        const action = this.describe(req, data);
        if (!action) return;
        // Đăng nhập: chưa có request.user, lấy người dùng từ kết quả trả về
        const user = req.user ?? data?.user;
        // Ghi vào database, không bắt client phải chờ (lỗi ghi nhật ký thì bỏ qua, không làm hỏng request)
        void this.activity.add(user?.name ?? 'Khách', user?.role ?? '-', action).catch(() => undefined);
      }),
    );
  }

  // Đổi request thành một câu tiếng Việt dễ đọc
  private describe(req: Request & { file?: Express.Multer.File }, data: any): string | null {
    const path = req.path;
    const id = data?.id;
    if (path === '/auth/login') return 'đã đăng nhập';
    if (req.method === 'POST' && path === '/tasks') return `đã tạo công việc #${id} «${data?.title}»`;
    if (req.method === 'POST' && path.endsWith('/attachment')) return `đã đính kèm file «${req.file?.originalname}» vào công việc #${id}`;
    if (req.method === 'PATCH') {
      const COL: Record<string, string> = { todo: 'Cần làm', in_progress: 'Đang làm', done: 'Hoàn thành' };
      if (req.body?.status) return `đã chuyển công việc #${id} sang «${COL[req.body.status] ?? req.body.status}»`;
      if (req.body?.done === true) return `đã đánh dấu xong công việc #${id}`;
      if (req.body?.done === false) return `đã mở lại công việc #${id}`;
      return `đã sửa công việc #${id}`;
    }
    if (req.method === 'DELETE') return `đã xóa công việc #${id} «${data?.title}»`;
    return null;
  }
}
