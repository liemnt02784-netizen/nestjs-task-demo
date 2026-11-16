import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface.js';
import { diskStorage } from 'multer';
import { extname } from 'node:path';

// Chỉ nhận ảnh và PDF
const ALLOWED = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf'];
export const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

// Cấu hình cho FileInterceptor (dùng thư viện multer bên dưới)
export const uploadOptions: MulterOptions = {
  // Lưu file vào thư mục uploads/ của dự án, đặt tên mới để không trùng
  storage: diskStorage({
    destination: 'uploads',
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      cb(null, unique + extname(file.originalname).toLowerCase());
    },
  }),
  // Quá 2 MB thì multer dừng lại và báo lỗi (Nest trả 413)
  limits: { fileSize: MAX_SIZE },
  // Sai loại file thì từ chối ngay, chưa ghi xuống ổ đĩa
  fileFilter: (_req, file, cb) => {
    // multer đọc tên file theo bảng mã latin1 → đổi lại UTF-8 để tên tiếng Việt không bị lỗi dấu
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    if (ALLOWED.includes(file.mimetype)) cb(null, true);
    else cb(new BadRequestException('Chỉ nhận ảnh (png, jpg, gif, webp) hoặc PDF', { errorCode: 'FILE_TYPE_NOT_ALLOWED' }), false);
  },
};
