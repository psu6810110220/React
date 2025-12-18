// src/components/EditBook.jsx
import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select, Card, message, Spin } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // เพิ่ม useParams เพื่อดึง ID

const URL_BOOK = "/api/book";
const URL_CATEGORY = "/api/book-category";

export default function EditBook() {
  const navigate = useNavigate();
  const { id } = useParams(); // 1. ดึง ID จาก URL (เช่น /books/edit/10)
  const [form] = Form.useForm();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false); // สถานะตอนกด Save
  const [fetching, setFetching] = useState(true); // สถานะตอนโหลดข้อมูลเริ่มต้น

  // 2. ดึงข้อมูลหนังสือ และ หมวดหมู่ เมื่อเปิดหน้านี้
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ยิง API 2 ตัวพร้อมกัน (ดึงหมวดหมู่ และ ดึงข้อมูลหนังสือตาม ID)
        const [categoryRes, bookRes] = await Promise.all([
          axios.get(URL_CATEGORY),
          axios.get(`${URL_BOOK}/${id}`)
        ]);

        // จัดเตรียมข้อมูลหมวดหมู่
        setCategories(categoryRes.data.map(c => ({ label: c.name, value: c.id })));

        // นำข้อมูลหนังสือที่ได้ มาใส่ลงใน Form
        const bookData = bookRes.data;
        form.setFieldsValue({
          title: bookData.title,
          author: bookData.author,
          price: Number(bookData.price),
          stock: Number(bookData.stock),
          categoryId: bookData.category?.id // ต้อง map ให้ตรงกับ value ของ Select
        });

      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("ไม่พบข้อมูลหนังสือ หรือเกิดข้อผิดพลาด");
        navigate('/books'); // ถ้าหาไม่เจอ ให้เด้งกลับหน้าหลัก
      } finally {
        setFetching(false);
      }
    };

    if (id) {
        fetchData();
    }
  }, [id, form, navigate]);

  // 3. ฟังก์ชันบันทึกข้อมูล (Update)
  const handleFinish = async (values) => {
    setLoading(true);
    try {
      // ส่งข้อมูลไปแก้ไขที่ Backend 
      await axios.patch(`${URL_BOOK}/${id}`, values);
      
      message.success('แก้ไขข้อมูลสำเร็จ!');
      navigate('/books'); // แก้เสร็จแล้วกลับไปหน้ารายการ

    } catch (error) {
      console.error("Update failed:", error);
      message.error('แก้ไขข้อมูลล้มเหลว');
    } finally {
      setLoading(false);
    }
  };

  // แสดง Loading หมุนๆ ระหว่างรอข้อมูลมา
  if (fetching) {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Spin size="large" tip="Loading book data..." />
        </div>
    );
  }

  return (
    <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
      {/* 4. ใช้ Card แทน Modal */}
      <Card title={`Edit Book (ID: ${id})`} style={{ width: 600, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
        >
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input title!' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="author" label="Author" rules={[{ required: true, message: 'Please input author!' }]}>
            <Input />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="price" label="Price" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item name="stock" label="Stock" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </div>

          <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Please select category!' }]}>
            <Select options={categories} placeholder="Select Category" />
          </Form.Item>

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Save Changes
            </Button>
            <Button type="default" block style={{ marginTop: 8 }} onClick={() => navigate('/books')}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}