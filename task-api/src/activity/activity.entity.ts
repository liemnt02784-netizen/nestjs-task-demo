import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Bảng "activities": mỗi dòng là một hoạt động do AuditInterceptor ghi lại
@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  who: string; // tên người làm

  @Column()
  role: string; // vai trò

  @Column()
  action: string; // câu mô tả, ví dụ "đã xóa công việc #3"

  @CreateDateColumn()
  at: Date;
}
