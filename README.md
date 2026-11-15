# Task API: demo đề tài "Tìm hiểu về NestJS"

Demo của nhóm thuyết trình môn **Phát triển Web Front-End**, Đại học Hoa Sen.
API quản lý công việc viết bằng **NestJS 12**, kèm một giao diện HTML gọi API thật.

| Thư mục | Là gì |
|---|---|
| `task-api/` | Back-end NestJS 12 (TypeScript, ESM), dữ liệu lưu trong bộ nhớ |
| `task-ui/` | Front-end HTML + `fetch`, gọi Task API qua CORS |

## Chạy thử

Cần Node.js 20 trở lên.

```bash
cd task-api
npm install
npm run start:dev        # API chạy ở http://localhost:3000
```

- Tài liệu Swagger: http://localhost:3000/docs
- Giao diện: mở terminal khác, chạy `cd task-ui` rồi `npx serve -l 5500` (hoặc `python -m http.server 5500`), sau đó vào http://localhost:5500
- Chìa khóa demo cho các route ghi dữ liệu: header `x-api-key: hoasen-2026` (chỉ để demo; đặt biến môi trường `API_KEY` để đổi)

## 7 bước demo

| Bước | Tính năng | File chính |
|---|---|---|
| 1 | Tạo dự án bằng Nest CLI | `src/main.ts`, `src/app.module.ts` |
| 2 | CRUD công việc | `src/tasks/tasks.controller.ts`, `tasks.service.ts` |
| 3 | Validation (DTO + ValidationPipe, ParseIntPipe) | `src/tasks/dto/`, `src/main.ts` |
| 4 | Guard kiểm tra API key (401 / 403) | `src/common/api-key/api-key.guard.ts` |
| 5 | Interceptor đo thời gian, header `X-Response-Time` | `src/common/logging/logging.interceptor.ts` |
| 6 | Swagger tự sinh tài liệu tại `/docs` | `src/main.ts`, `nest-cli.json` |
| 7 | Mới ở v12: Standard Schema (Zod) + `errorCode` | `src/tasks/schemas/task-query.schema.ts` |

Gửi thử từng request trong `task-api/requests.http` bằng extension **REST Client** của VS Code.

## Các route

| Phương thức | Đường dẫn | Cần key |
|---|---|---|
| GET | `/tasks?done=true\|false&q=từ khóa` | Không |
| GET | `/tasks/:id` | Không |
| POST | `/tasks` | Có |
| PATCH | `/tasks/:id` | Có |
| DELETE | `/tasks/:id` | Có |
