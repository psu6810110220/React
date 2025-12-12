import { useState, useEffect } from 'react';
import { Divider, Spin, Button, Modal } from 'antd'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import BookList from './components/BookList';

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
    setAiResult("");
    setAiLoading(true);
    setCurrentBookName(book.title);

    try {
      const prompt = `ช่วยสรุปเรื่องย่อและจุดเด่นของหนังสือเรื่อง "${book.title}" เขียนโดย ${book.author} ให้หน่อย แบบสั้นๆ กระชับ`;
      
      // เรียก API Backend 
      const response = await axios.post('/api/gemini/chat', { message: prompt });
      
      setAiResult(response.data.reply || response.data.text || "ไม่ได้รับคำตอบจาก AI"); 
    } catch (error) {
      console.error(error);
      setAiResult("เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI");
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
              onDeleted={handleDeleteBook}
              onEdit={(book) => navigate(`/books/edit/${book.id}`)}
              onAskAi={handleAskGemini} 
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