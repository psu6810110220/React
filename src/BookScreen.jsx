import { useState, useEffect } from 'react';
import { Divider, Spin, Button, Modal, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ---------------------------------------------------------
// 🚨 แก้ 2 บรรทัดนี้ครับ (ใช้ . แทน ..)
// ---------------------------------------------------------
import BookList from './components/BookList';  // แก้เป็น ./
import { inquireAboutBook } from './gemini/geminiService'; // แก้เป็น ./

// ... (โค้ดส่วนอื่นเหมือนเดิม)

const URL_BOOK = "/api/book";

function BookScreen() {
  const navigate = useNavigate();
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);

  // State สำหรับ AI Modal
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
      notification.error({ message: 'ไม่สามารถดึงข้อมูลหนังสือได้' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 2. กด Like
  const handleLikeBook = async (book) => {
    try {
      await axios.patch(`${URL_BOOK}/${book.id}`, { likeCount: (book.likeCount || 0) + 1 });
      fetchBooks(); // รีโหลดข้อมูลใหม่
    } catch (error) {
      console.error(error);
      notification.error({
        message: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถกด Like ได้',
      });
    }
  };

  // 3. กดลบ (Delete)
  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`${URL_BOOK}/${bookId}`);
      fetchBooks(); // รีโหลดข้อมูลใหม่
      notification.success({ message: 'ลบหนังสือเรียบร้อยแล้ว' });
    } catch (error) {
      console.error(error);
      notification.error({
        message: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถลบหนังสือได้',
      });
    }
  };

  // 4. ฟังก์ชันคุยกับ Gemini AI
  const handleAskGemini = async (book) => {
    setIsAiModalOpen(true);
    setAiResult("กำลังเชื่อมต่อกับ AI...");
    setAiLoading(true);
    setCurrentBookName(book.title);

    try {
      // สร้างคำถาม
      const prompt = `สรุปหนังสือเรื่อง "${book.title}" โดย ${book.author} สั้นๆ เป็นภาษาไทย`;
      
      // เรียกใช้ AI Service (ที่แก้ path แล้ว)
      const response = await inquireAboutBook(prompt);
      setAiResult(response);

    } catch (error) {
      console.error("Gemini Error:", error);
      setAiResult(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

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
            onDelete={handleDeleteBook}
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
            <div style={{ marginTop: 10 }}>กำลังวิเคราะห์หนังสือ...</div>
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