import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Chưa nhập tên đăng nhập' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Chưa nhập mật khẩu' })
  password: string;
}
