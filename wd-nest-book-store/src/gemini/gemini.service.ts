import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeminiService {
  // ⚠️ สำคัญ: เอา Key ที่ลงท้ายด้วย ...96SY มาใส่ตรงนี้แทนอันเก่านะครับ
  private apiKey = "AIzaSyCzg6to8M3mdI-SzoP_rSpKQwwYaG5F6_4"; 

  async chat(message: string) {
    // เปลี่ยน Log เพื่อให้เรารู้ว่าโค้ดใหม่ทำงานแล้ว
    console.log("🤖 Asking Gemini 1.5 Flash (New Code)...");
    
    // ✅ ใช้ URL รุ่นใหม่ล่าสุด (gemini-1.5-flash) ที่รองรับแน่นอน
    // เติม -001 ต่อท้ายครับ เพื่อระบุเวอร์ชันที่แน่นอน
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${this.apiKey}`;
    try {
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: message }] }]
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      // ดึงคำตอบ (ใช้ any ป้องกัน error typescript)
      const resData: any = response.data;
      const text = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      return { reply: text || "AI ไม่ตอบกลับ" };

    } catch (error) {
      console.error("❌ AI Error:", error.response?.data || error.message);
      return { reply: "AI Error: " + (error.response?.data?.error?.message || error.message) };
    }
  }
}