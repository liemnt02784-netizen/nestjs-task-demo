// Tạo dữ liệu mẫu cho buổi demo (server phải đang chạy): node seed.mjs
// Mỗi công việc do một tài khoản khác nhau tạo, để thấy "tạo bởi" và nhật ký hoạt động.
const B = 'http://localhost:3000';
const KEY = { admin: 'hoasen-2026', editor: 'editor-2026', user: 'user-2026' };
const call = (method, path, key, body) =>
  fetch(B + path, { method, headers: { 'x-api-key': key, 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) }).then((r) => r.json());

// Hạn chót tính từ hôm nay: +n ngày (số âm = đã qua)
const day = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

const TASKS = [
  { by: 'admin', title: 'Học NestJS: Module, Controller, Service', description: 'Bài 0–1: tạo dự án, CRUD', status: 'done', priority: 'medium', dueDate: day(-10) },
  { by: 'admin', title: 'Thêm Validation cho DTO', description: 'ValidationPipe, whitelist, ParseIntPipe', status: 'done', priority: 'high', dueDate: day(-7) },
  { by: 'editor', title: 'Viết Guard phân quyền', description: 'admin, editor, user: ApiKeyGuard + RolesGuard + @Roles', status: 'done', priority: 'high', dueDate: day(-2) },
  { by: 'editor', title: 'Làm slide thuyết trình', description: 'Màu đỏ NestJS, nền sáng, demo 8 bước', status: 'in_progress', priority: 'high', dueDate: day(1) },
  { by: 'admin', title: 'Viết kịch bản Word', description: 'Lời thoại, thao tác, câu cô hỏi cho từng bước', status: 'in_progress', priority: 'medium', dueDate: day(3) },
  { by: 'user', title: 'Gửi slide và link GitHub cho nhóm', description: 'Nhựt Trung, Kiệt, Hùng Trung xem trước phần mình', status: 'todo', priority: 'medium', dueDate: day(2) },
  { by: 'user', title: 'Tập dượt cả nhóm', description: 'Canh đủ 20 phút, mỗi bạn tự trả lời câu hỏi phần mình', status: 'todo', priority: 'low', dueDate: day(5) },
];

for (const t of TASKS) {
  const { by, ...body } = t;
  // user được tạo nhưng không được sửa → tạo với status luôn trong body
  const created = await call('POST', '/tasks', KEY[by], body);
  console.log(`#${created.id} [${created.status}] ${created.title} (tạo bởi ${created.createdBy})`);
}
