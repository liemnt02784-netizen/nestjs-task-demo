# Task App: demo đề tài "Tìm hiểu về NestJS"

Demo của nhóm thuyết trình môn **Phát triển Web Front-End**, Đại học Hoa Sen.
Ứng dụng quản lý công việc: back-end viết bằng **NestJS 12**, front-end bằng HTML, CSS, JavaScript, dữ liệu lưu trong **SQLite**.

| Thư mục | Là gì |
|---|---|
| `task-api/` | **Back-end** NestJS 12 (TypeScript, ESM), TypeORM + SQLite, chạy ở cổng 3000, chỉ trả JSON |
| `task-ui/` | **Front-end** HTML + `fetch`: trang đăng nhập, bảng 3 cột Cần làm / Đang làm / Hoàn thành |
| `file-demo/` | File để thử upload: ảnh hợp lệ, ảnh quá 2 MB (413), file .txt (400) |

## Chạy thử

Cần Node.js 20 trở lên.

```bash
cd task-api
npm install
npm run start:dev        # API ở http://localhost:3000, tự tạo file tasks.sqlite
node seed.mjs            # (terminal khác) tạo 7 công việc mẫu
```

```bash
cd task-ui
python -m http.server 5500   # hoặc: npx serve -l 5500
```

Mở http://localhost:5500 → trang đăng nhập. Tài liệu API (Swagger): http://localhost:3000/docs

### Tài khoản demo (chỉ để demo)

| Tên đăng nhập | Mật khẩu | Vai trò | Được làm gì |
|---|---|---|---|
| `admin` | `admin123` | admin | xem, tạo, sửa, đính kèm, **xóa** |
| `editor` | `editor123` | editor | xem, tạo, sửa, đính kèm |
| `user` | `user123` | user | xem, tạo |

Mật khẩu được băm (scrypt) trong bảng `users`. Đăng nhập trả về chìa khóa gửi kèm header `x-api-key`.

## 8 bước demo

| Bước | Tính năng | File chính |
|---|---|---|
| 1 | Tạo dự án bằng Nest CLI | `src/main.ts`, `src/app.module.ts` |
| 2 | CRUD + database SQLite (TypeORM, Entity, Repository) | `src/tasks/entities/task.entity.ts`, `tasks.service.ts` |
| 3 | Validation (DTO + ValidationPipe, ParseIntPipe) | `src/tasks/dto/`, `src/main.ts` |
| 4 | Đăng nhập + phân quyền: `ApiKeyGuard`, `RolesGuard`, custom decorator `@Roles`, `@CurrentUser` | `src/auth/`, `src/users/`, `src/common/` |
| 5 | Interceptor: đo thời gian, nhật ký "ai làm gì", upload file (`FileInterceptor`) | `src/common/logging/`, `src/activity/`, `src/tasks/upload.config.ts` |
| 6 | Exception Filter: lỗi cùng một khuôn, tiếng Việt, có `path`, `timestamp` | `src/common/filters/http-error.filter.ts` |
| 7 | Swagger tự sinh tài liệu tại `/docs` | `src/main.ts`, `nest-cli.json` |
| 8 | Mới ở v12: Standard Schema (Zod) + `errorCode` | `src/tasks/schemas/task-query.schema.ts` |

Gửi thử từng request trong `task-api/requests.http` bằng extension **REST Client** của VS Code. Xem dữ liệu trong database: `node peek-db.mjs`.

## Các route

| Phương thức | Đường dẫn | Ai được gọi |
|---|---|---|
| POST | `/auth/login` | mọi người |
| GET | `/tasks?done=true\|false&q=từ khóa` | mọi người |
| GET | `/tasks/:id` | mọi người |
| POST | `/tasks` | đã đăng nhập |
| PATCH | `/tasks/:id` | admin, editor |
| POST | `/tasks/:id/attachment` (ảnh/PDF ≤ 2 MB) | admin, editor |
| DELETE | `/tasks/:id` | admin |
| GET | `/activity` | mọi người |
