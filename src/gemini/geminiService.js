import axios from 'axios';

/**
 * ฟังก์ชันสำหรับถาม AI ผ่าน Backend (Secure Way)
 * ไม่ต้องใส่ Key ตรงนี้ เพราะ Key อยู่ที่ Server แล้ว
 */
export const inquireAboutBook = async (prompt) => {
  try {
    // ส่งคำถามไปที่ Backend ของเราเอง (ที่ไฟล์ app.controller.ts)
    // URL นี้สอดคล้องกับที่คุณตั้งค่า Prefix 'api' ไว้ในโปรเจกต์
    const response = await axios.post('/api/gemini-chat', { prompt });

    // รับคำตอบที่เป็นข้อความกลับมา
    return response.data;

  } catch (error) {
    console.error("Backend connection error:", error);
    return "ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับ Server (ตรวจสอบว่า Backend รันอยู่หรือไม่)";
  }
};