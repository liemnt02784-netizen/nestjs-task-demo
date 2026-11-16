import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class Attachment {
  originalName: string; // tên file gốc người dùng chọn
  url: string; // đường dẫn để xem file, ví dụ /uploads/1731740000000-123456.png
  mimetype: string; // loại file, ví dụ image/png
  size: number; // dung lượng (byte)
}

export const STATUSES = ['todo', 'in_progress', 'done'] as const;
export type TaskStatus = (typeof STATUSES)[number];
export const PRIORITIES = ['low', 'medium', 'high'] as const;
export type Priority = (typeof PRIORITIES)[number];

// @Entity: class này là một BẢNG trong database (bảng "tasks").
// Mỗi thuộc tính có @Column là một CỘT. TypeORM tự tạo bảng từ class này.
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn() // khóa chính, database tự tăng 1, 2, 3...
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true }) // được phép để trống
  description?: string;

  @Column({ default: false })
  done: boolean; // giữ lại cho bộ lọc ?done= (bước Zod); luôn khớp với status === 'done'

  @Column({ default: 'todo' })
  status: TaskStatus; // cột trên bảng Kanban

  @Column({ default: 'medium' })
  priority: Priority;

  @Column({ nullable: true })
  dueDate?: string; // hạn chót YYYY-MM-DD

  @CreateDateColumn() // database tự ghi thời điểm tạo
  createdAt: Date;

  @Column({ nullable: true })
  createdBy?: string; // tên người tạo, lấy từ @CurrentUser()

  @Column({ type: 'simple-json', nullable: true }) // lưu object dưới dạng chuỗi JSON
  attachment?: Attachment;
}
