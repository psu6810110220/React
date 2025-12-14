import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // กำหนด path หลักเป็น /api/auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') // กำหนด path ย่อยเป็น /login
  async login(@Body() body: any) {
    // 1. ตรวจสอบชื่อผู้ใช้
    const user = this.authService.validateUser(body.username, body.password);
    
    // 2. ถ้าไม่เจอ ให้แจ้ง Error
    if (!user) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }

    // 3. ถ้าเจอ ให้ส่ง Token กลับไป
    return this.authService.login(user);
  }
}