// src/components/AddBook.jsx
import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select, Card, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // เรียกใช้ Hook สำหรับเปลี่ยนหน้า

// กำหนด Endpoint
const URL_BOOK = "/api/book";
const URL_CATEGORY = "/api/book-category";

export default function AddBook() {
  const navigate = useNavigate(); // สร้างฟังก์ชันสำหรับเปลี่ยนหน้า
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]); // เก็บรายการหมวดหมู่
  const [loading, setLoading] = useState(false); // สถานะกำลังโหลด

  // 1. ดึงข้อมูล Categories ทันทีที่เข้ามาหน้านี้
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(URL_CATEGORY);
        // แปลงข้อมูลให้เหมาะกับ Ant Design Select (ต้องมี label กับ value)
        setCategories(res.data.map(c => ({ label: c.name, value: c.id })));
      } catch (e) {
        console.error("Error fetching categories:", e);
        message.error("ไม่สามารถดึงข้อมูลหมวดหมู่ได้");
      }
    };
    fetchCategories();
  }, []);

  // 2. ฟังก์ชันเมื่อกดปุ่ม Submit (Create Book)
  const handleFinish = async (values) => {
    setLoading(true);
    try {
      // ยิง API เพื่อสร้างหนังสือใหม่
      await axios.post(URL_BOOK, values);
      
      message.success('สร้างหนังสือสำเร็จ!'); // แจ้งเตือนสีเขียว
      
      // 3. บันทึกเสร็จแล้ว สั่งให้เด้งกลับไปหน้า Books
      navigate('/books');
      
    } catch (error) {
      console.error(error);
      message.error('เกิดข้อผิดพลาดในการสร้างหนังสือ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
      {/* ใช้ Card เพื่อให้ดูเป็นหน้า Form ที่สวยงาม */}
      <Card title="Create New Book" style={{ width: 600, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        
        <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleFinish}
            autoComplete="off"
        >
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'กรุณากรอกชื่อหนังสือ' }]}>
                <Input placeholder="Enter book title" />
            </Form.Item>
            
            <Form.Item name="author" label="Author" rules={[{ required: true, message: 'กรุณากรอกชื่อผู้แต่ง' }]}>
                <Input placeholder="Enter author name" />
            </Form.Item>
            
            {/* Description (ถ้ามี) ถ้าไม่มีใน DB ก็ลบออกได้ */}
            <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} placeholder="Book description..." />
            </Form.Item>

            {/* จัด Price และ Stock ให้อยู่บรรทัดเดียวกัน */}
            <div style={{ display: 'flex', gap: 16 }}>
                <Form.Item name="price" label="Price" rules={[{ required: true }]} style={{ flex: 1 }}>
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="0.00" />
                </Form.Item>
                <Form.Item name="stock" label="Stock" rules={[{ required: true }]} style={{ flex: 1 }}>
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                </Form.Item>
            </div>

            <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่' }]}>
                <Select 
                    options={categories} 
                    placeholder="Select a category" 
                    loading={categories.length === 0} // โชว์ loading ถ้า data ยังไม่มา
                />
            </Form.Item>

            <Form.Item style={{ marginTop: 20 }}>
                <Button type="primary" htmlType="submit" loading={loading} block size="large">
                    Create Book
                </Button>
                {/* ปุ่ม Cancel กดแล้วกลับหน้าหลักทันที */}
                <Button type="default" block style={{ marginTop: 8 }} onClick={() => navigate('/books')}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
      </Card>
    </div>
  );
}