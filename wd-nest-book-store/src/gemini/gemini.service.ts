// src/gemini/gemini.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeminiService {
  // 🟢 ผมใส่ Key จากรูปของคุณให้เลยครับ (AlzaSyB0...) จะได้ชัวร์
  private apiKey = "AIzaSyB0uXmgPNXXBdqOWa5qrEIRoL0WV8qfWqk".trim(); 

  async chat(message: string) {
    console.log("🚀 Final Test: Gemini 1.5 Flash (API Enabled)..."); 

    try {
      // ✅ ใช้รุ่น 1.5-flash (รุ่นปัจจุบันสำหรับ Project ใหม่)
      // ตอนนี้ API เปิดแล้ว บรรทัดนี้ต้องทำงานได้แน่นอนครับ
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

      const response = await axios.post(url, {
        contents: [{ parts: [{ text: message }] }]
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return { reply: text || "AI ไม่ตอบกลับ" };

    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      return { reply: "AI Error: " + (error.response?.data?.error?.message || error.message) };
    }
  }
}