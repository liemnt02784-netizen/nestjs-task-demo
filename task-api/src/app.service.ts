import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Xin chào nhóm NestJS!';
  }
  getAbout(): { deTai: string, nhom: string[] } {
    return { "deTai": "Tìm hiểu về NestJS", "nhom": ["Thanh Liêm", "Võ Nhựt Trung", "Đỗ Nguyễn Tuấn Kiệt", "Nguyễn Hùng Trung"]
    };
  }
}
