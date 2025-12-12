// src/components/AppLayout.jsx
import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

export default function AppLayout({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  // เช็คว่าเมนูไหนควร Active (ดูจาก URL)
  const currentKey = location.pathname.includes('/categories') ? 'categories' : 'books';

  // รายการเมนู
  const menuItems = [
    { key: 'books', label: 'Book Store', onClick: () => navigate('/books') },
    { key: 'categories', label: 'Manage Categories', onClick: () => navigate('/categories') },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ส่วนหัวเว็บ (Navbar) */}
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{ color: 'white', margin: '0 20px 0 0', cursor: 'pointer' }} onClick={() => navigate('/books')}>
            My BookStore
          </h2>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[currentKey]}
            items={menuItems}
            style={{ minWidth: '300px' }}
          />
        </div>
        
        {/* ปุ่ม Logout ย้ายมาไว้ตรงนี้ จะได้เห็นทุกหน้า */}
        <Button type="primary" danger onClick={onLogout}>
          Logout
        </Button>
      </Header>

      {/* ส่วนเนื้อหา (Page Content) */}
      <Content style={{ padding: '24px 50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 380, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {/* Outlet คือจุดที่หน้าอื่นๆ (BookScreen, AddBook, etc.) จะมาแสดงผล */}
          <Outlet /> 
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Book Store System ©2025 Created by Ant Design
      </Footer>
    </Layout>
  );
}