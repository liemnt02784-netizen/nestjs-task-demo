import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

// Thông báo mặc định (tiếng Anh) của NestJS / thư viện → đổi sang tiếng Việt cho người dùng đọc
const VI: Record<string, string> = {
  'Forbidden resource': 'Bạn không có quyền làm việc này',
  Unauthorized: 'Bạn chưa đăng nhập',
  'File too large': 'File vượt quá 2 MB',
  'Unexpected field': 'Sai tên field khi gửi file (phải là "file")',
};

// Exception Filter: đứng CUỐI vòng đời request, bắt MỌI lỗi bị throw ở bất kỳ đâu
// (Guard, Pipe, Interceptor, Controller, Service) và quyết định trả lỗi về cho client trông ra sao.
// @Catch() để trống = bắt tất cả, kể cả lỗi lạ không phải HttpException (lỗi code, lỗi database...).
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('Error');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // 1. Lỗi HTTP do mình hoặc Nest chủ động throw (400, 401, 403, 404, 413...): giữ nguyên nội dung
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const raw = exception.getResponse();
      const body = typeof raw === 'string' ? { message: raw } : { ...(raw as Record<string, unknown>) };
      if (typeof body.message === 'string' && VI[body.message]) body.message = VI[body.message];
      return res.status(status).json({ ...body, statusCode: status, path: req.url, timestamp: new Date().toISOString() });
    }

    // 2. Lỗi bất ngờ (bug trong code, database hỏng...): ghi chi tiết ra terminal cho lập trình viên,
    //    nhưng chỉ trả câu chung chung cho client, KHÔNG lộ chi tiết bên trong server.
    this.logger.error(`${req.method} ${req.url}`, exception instanceof Error ? exception.stack : String(exception));
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Máy chủ gặp lỗi, vui lòng thử lại sau',
      error: 'Internal Server Error',
      statusCode: 500,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
