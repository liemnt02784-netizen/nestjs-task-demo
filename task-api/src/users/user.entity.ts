import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type Role = 'admin' | 'editor' | 'user';

// Bảng "users": tài khoản đăng nhập
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // không cho 2 người trùng tên đăng nhập
  username: string;

  @Column()
  name: string; // tên hiển thị

  @Column()
  role: Role;

  // KHÔNG lưu mật khẩu gốc. Chỉ lưu "dấu vân tay" đã băm (scrypt) dạng "muối:kết quả băm".
  // select: false → mặc định không bao giờ đọc cột này ra, tránh lỡ trả mật khẩu về cho client.
  @Column({ select: false })
  passwordHash: string;

  @Column({ unique: true, select: false })
  apiKey: string; // chìa khóa gửi trong header x-api-key sau khi đăng nhập
}
