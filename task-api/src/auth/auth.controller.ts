import { Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto.js';
import { UsersService } from '../users/users.service.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly users: UsersService) {}

  // POST /auth/login: tìm tài khoản trong database, đúng mật khẩu thì trả về chìa khóa (apiKey)
  @Post('login')
  @HttpCode(200) // đăng nhập không tạo gì mới nên trả 200 thay vì 201
  @ApiOperation({ summary: 'Đăng nhập, nhận chìa khóa x-api-key' })
  async login(@Body() dto: LoginDto) {
    const found = await this.users.verify(dto.username, dto.password);
    if (!found) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu', { errorCode: 'LOGIN_FAILED' });
    }
    const { apiKey, ...user } = found;
    return { apiKey, user };
  }
}
