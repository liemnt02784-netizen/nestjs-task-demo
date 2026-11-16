import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { User, type Role } from './user.entity.js';

// 3 tài khoản demo, tự thêm vào database ở lần chạy đầu tiên (mật khẩu chỉ để demo)
const SEED: { username: string; password: string; name: string; role: Role; apiKey: string }[] = [
  { username: 'admin', password: 'admin123', name: 'Quản trị viên', role: 'admin', apiKey: 'hoasen-2026' },
  { username: 'editor', password: 'editor123', name: 'Biên tập viên', role: 'editor', apiKey: 'editor-2026' },
  { username: 'user', password: 'user123', name: 'Người dùng', role: 'user', apiKey: 'user-2026' },
];

// Băm mật khẩu: thêm "muối" ngẫu nhiên rồi băm bằng scrypt (có sẵn trong Node, không cần cài thêm)
function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  return salt + ':' + scryptSync(password, salt, 32).toString('hex');
}

function checkPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':');
  const test = scryptSync(password, salt, 32);
  return timingSafeEqual(test, Buffer.from(hash, 'hex')); // so sánh an toàn, chống đoán theo thời gian
}

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger('Users');

  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  // OnModuleInit: Nest gọi hàm này một lần khi khởi động → bảng trống thì thêm 3 tài khoản demo
  async onModuleInit() {
    if ((await this.repo.count()) > 0) return;
    for (const s of SEED) {
      await this.repo.save(this.repo.create({ username: s.username, name: s.name, role: s.role, apiKey: s.apiKey, passwordHash: hashPassword(s.password) }));
    }
    this.logger.log('Đã tạo 3 tài khoản demo: admin, editor, user');
  }

  // Đăng nhập: tìm theo tên, kiểm tra mật khẩu. Đúng → trả về người dùng kèm apiKey; sai → null
  async verify(username: string, password: string) {
    const user = await this.repo.findOne({
      where: { username },
      select: { id: true, username: true, name: true, role: true, passwordHash: true, apiKey: true }, // cần đọc 2 cột ẩn
    });
    if (!user || !checkPassword(password, user.passwordHash)) return null;
    const { passwordHash: _h, ...rest } = user;
    return rest;
  }

  // Dùng trong ApiKeyGuard: tìm người dùng theo chìa khóa (không có → null)
  findByApiKey(apiKey: string) {
    return this.repo.findOneBy({ apiKey });
  }
}
