import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { UsersService } from './users.service.js';

// @Global: module nào cũng dùng được UsersService mà không cần import lại
// (ApiKeyGuard dùng ở TasksModule, AuthController dùng ở AuthModule...)
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
