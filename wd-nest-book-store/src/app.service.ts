import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AppService {
  async getGeminiSummary(prompt: string): Promise<string> {
    
    // 1. ดึง Key มาเช็คก่อน (ใช้ || "" เพื่อหลอก TypeScript ว่ามีค่าแน่ๆ จะได้ไม่แดง)
    // 👇 ใส่รหัสตรงๆ ลงไปเลยครับ ไม่ต้องง้อไฟล์ .env แล้ว
    const apiKey = "AIzaSyDggsZ2ntYiWhLPj6Bw95sF8bKua5r96SY";
    
    // ถ้าไม่มี Key จริงๆ ให้แจ้งเตือน
    if (!apiKey) {
      return "Error: ไม่พบ API Key กรุณาตรวจสอบไฟล์ .env";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const result = await model.generateContent(prompt);
      
      // 2. แก้จุดที่แดง: ลบคำว่า await ออก (เพราะ Library ตัวใหม่ไม่ต้องรอแล้ว)
      const response = result.response; 
      
      return response.text();
    } catch (error) {
      console.error("AI Error:", error);
      return "เกิดข้อผิดพลาดในการประมวลผล AI";
    }
  }

  getHello(): string { return 'Hello World!'; }
}