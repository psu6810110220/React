// src/CategoryScreen.jsx
import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const URL_CATEGORY = "/api/book-category";

export default function CategoryScreen() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State สำหรับ Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // เก็บตัวที่จะแก้ (ถ้า null คือเพิ่มใหม่)
  const [form] = Form.useForm();

  // 1. ดึงข้อมูล Category
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(URL_CATEGORY);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      message.error("ดึงข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. ฟังก์ชันเปิด Modal (ใช้ร่วมกันทั้ง Add และ Edit)
  const openModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      form.setFieldsValue(category); // ถ้าแก้ ให้ใส่ข้อมูลเก่า
    } else {
      form.resetFields(); // ถ้าเพิ่ม ให้ล้างฟอร์ม
    }
    setIsModalOpen(true);
  };

  // 3. ฟังก์ชันบันทึก (Add / Edit)
  const handleFinish = async (values) => {
    try {
      if (editingCategory) {
        // กรณีแก้ไข (PATCH)
        await axios.patch(`${URL_CATEGORY}/${editingCategory.id}`, values);
        message.success("แก้ไขหมวดหมู่สำเร็จ");
      } else {
        // กรณีเพิ่มใหม่ (POST)
        await axios.post(URL_CATEGORY, values);
        message.success("เพิ่มหมวดหมู่สำเร็จ");
      }
      setIsModalOpen(false); // ปิด Modal
      fetchCategories(); // โหลดข้อมูลใหม่
    } catch (err) {
      message.error("บันทึกไม่สำเร็จ");
    }
  };

  // 4. ฟังก์ชันลบ
  const handleDelete = (id) => {
    Modal.confirm({
      title: "ยืนยันการลบ?",
      content: "คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่",
      onOk: async () => {
        try {
          await axios.delete(`${URL_CATEGORY}/${id}`);
          message.success("ลบสำเร็จ");
          fetchCategories();
        } catch (err) {
          message.error("ลบไม่สำเร็จ (อาจมีการใช้งานอยู่)");
        }
      }
    });
  };

  // ตั้งค่าคอลัมน์ตาราง
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: 'Category Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button onClick={() => openModal(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Category Management</h1>
        <Space>
            {/* ปุ่มย้อนกลับไปหน้าหนังสือ */}
            <Button onClick={() => navigate('/books')}>Back to Books</Button>
            {/* ปุ่มเพิ่มหมวดหมู่ */}
            <Button type="primary" onClick={() => openModal(null)}>+ Add Category</Button>
        </Space>
      </div>

      <Table 
        dataSource={categories} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        bordered
      />

      {/* Modal สำหรับฟอร์ม */}
      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()} // กด OK ให้ส่งฟอร์ม
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item 
            name="name" 
            label="Category Name" 
            rules={[{ required: true, message: 'Please input category name' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}