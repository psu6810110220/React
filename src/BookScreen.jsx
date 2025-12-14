import { useState, useEffect } from 'react';
import { Divider, Spin, Button, Modal } from 'antd'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import BookList from './components/BookList';
import { GoogleGenerativeAI } from "@google/generative-ai";
const URL_BOOK = "/api/book";

function BookScreen() { 
  const navigate = useNavigate();
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- State สำหรับ AI Modal ---
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [currentBookName, setCurrentBookName] = useState("");

  // 1. ดึงข้อมูลหนังสือ
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL_BOOK);
      setBookData(response.data);
    } catch (error) { 
      console.error('Error fetching books:', error); 
    } finally { 
      setLoading(false); 
    }
  }

  // 2. กด Like
  const handleLikeBook = async (book) => {
    try {
      await axios.patch(`${URL_BOOK}/${book.id}`, { likeCount: (book.likeCount || 0) + 1 });
      fetchBooks();
    } catch (error) { console.error(error); }
  }

  // 3. กดลบ (Delete)
  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`${URL_BOOK}/${bookId}`);
      fetchBooks();
    } catch (error) { console.error(error); }
  }

  // 4. ฟังก์ชันคุยกับ Gemini AI
  const handleAskGemini = async (book) => {
    setIsAiModalOpen(true);
    setAiResult("กำลังเชื่อมต่อกับ AI...");
    setAiLoading(true);
    setCurrentBookName(book.title);

    try {
        // -------------------------------------------------------------------
        // 1. วาง Key ใหม่ที่คุณสร้างตรงนี้! (ห้ามมีช่องว่าง)
        const API_KEY = "AIzaSyCzg6to8M3mdI-SzoP_rSpKQwwYaG5F6_4"; 
        // -------------------------------------------------------------------

        if (!API_KEY || API_KEY.startsWith("วาง_API")) {
            throw new Error("กรุณาใส่ API Key ที่ถูกต้องก่อนใช้งาน");
        }

        // 2. สร้าง genAI (บรรทัดนี้ต้องไม่ Comment)
        const genAI = new GoogleGenerativeAI(API_KEY); 

        // 3. ใช้โมเดล gemini-pro 
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 

        const prompt = `สรุปหนังสือ "${book.title}" โดย ${book.author} สั้นๆ เป็นภาษาไทย`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        setAiResult(response.text());

    } catch (error) {
        console.error("Gemini Error:", error);
        // แสดง Error ออกมาใน Modal เพื่อให้เห็นสาเหตุ
        setAiResult(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
        setAiLoading(false);
    }
};

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div> 
      {/* ปุ่ม Action ด้านขวาบน */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" }}>
        <Button 
            size="large" 
            onClick={() => navigate('/categories')}
        >
            Manage Categories
        </Button>

        <Button 
            type="primary" 
            size="large" 
            onClick={() => navigate('/books/add')} 
        >
            + Create New Book
        </Button>
      </div>
      
      <Divider orientation="left" style={{ borderColor: '#d9d9d9' }}>My Books List</Divider>
      
      <Spin spinning={loading}>
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <BookList
              data={bookData}
              onLiked={handleLikeBook}
              onDelete={handleDeleteBook}  // <--- แก้บรรทัดนี้ครับ (ลบตัว d ออก)
              onEdit={(book) => navigate(`/books/edit/${book.id}`)}
              onAskAI={handleAskGemini}
            />
        </div>
      </Spin>

      {/* Modal แสดงผลลัพธ์ AI */}
      <Modal
        title={`🤖 AI Analysis: ${currentBookName}`}
        open={isAiModalOpen}
        onCancel={() => setIsAiModalOpen(false)}
        footer={null}
        width={600}
      >
        {aiLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" /> 
                <div style={{ marginTop: 10 }}>กำลังอ่านหนังสือ...</div>
            </div>
        ) : (
            <div style={{ padding: '10px', lineHeight: '1.6', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                {aiResult}
            </div>
        )}
      </Modal>
    </div>
  );
}

export default BookScreen;