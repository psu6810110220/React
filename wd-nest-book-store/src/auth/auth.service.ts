import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // ฟังก์ชันตรวจสอบรหัสผ่าน (แบบง่าย สำหรับทดสอบ)
  validateUser(username: string, pass: string): any {
    // กำหนดให้ User ชื่อ 'demo' และรหัสอะไรก็ได้ผ่านหมด (หรือจะกำหนดรหัสตรงนี้ก็ได้)
    if (username === 'demo') { // && pass === '1234' ถ้าอยากล็อครหัส
      return { userId: 1, username: 'demo' };
    }
    return null;
  }

  // ฟังก์ชันสร้าง Token ส่งกลับไปให้หน้าเว็บ
  async login(user: any) {
    return {
      access_token: 'mock-jwt-token-created-by-auth-module', // ส่ง Token จำลอง
      user: user,
    };
  }
}