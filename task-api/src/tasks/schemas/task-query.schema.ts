import { z } from 'zod';

// Schema cho phần lọc trên địa chỉ: GET /tasks?done=true&q=slide
// Lưu ý: mọi giá trị trên địa chỉ (query string) đều là CHUỖI, kể cả "true"/"false".
export const taskQuerySchema = z.object({
  done: z.enum(['true', 'false'], { message: 'done chỉ nhận true hoặc false' })
    .transform((v) => v === 'true') // chuyển chuỗi 'true' thành boolean true, 'false' thành false
    .optional(),
  q: z.string().min(2, 'Từ khóa phải có ít nhất 2 ký tự').optional(),
});

export type TaskQuery = z.infer<typeof taskQuerySchema>;
