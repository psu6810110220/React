// src/components/AppLayout.jsx
import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

export default function AppLayout({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. ตรวจสอบ URL เพื่อระบุว่าเมนูไหนควร Active
  let currentKey = 'books'; // ค่าเริ่มต้น
  if (location.pathname.includes('/categories')) {
    currentKey = 'categories';
  } else if (location.pathname.includes('/dashboard')) {
    currentKey = 'dashboard';
  }

  // 2. รายการเมนูทั้งหมด (เพิ่ม Dashboard เข้ามาเป็นอันแรก)
  const menuItems = [
    { 
      key: 'dashboard', 
      label: '📊 Dashboard', 
      onClick: () => navigate('/dashboard') 
    },
    { 
      key: 'books', 
      label: '📚 Book Store', 
      onClick: () => navigate('/books') 
    },
    { 
      key: 'categories', 
      label: '🏷️ Manage Categories', 
      onClick: () => navigate('/categories') 
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ส่วนหัวเว็บ (Navbar) */}
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 
            style={{ color: 'white', margin: '0 20px 0 0', cursor: 'pointer', fontSize: '1.2rem' }} 
            onClick={() => navigate('/books')}
          >
            My BookStore
          </h2>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[currentKey]}
            items={menuItems}
            style={{ minWidth: '400px', borderBottom: 'none' }} 
          />
        </div>

        {/* ปุ่ม Logout */}
        <Button type="primary" danger onClick={onLogout}>
          Logout
        </Button>
      </Header>

      {/* ส่วนเนื้อหา (Page Content) */}
      <Content style={{ padding: '24px 50px' }}>
        <div style={{ 
          background: '#fff', 
          padding: 24, 
          minHeight: 380, 
          borderRadius: 8, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
        }}>
          {/* Outlet คือจุดที่หน้าอื่นๆ (BookScreen, DashboardScreen, etc.) จะมาแสดงผล */}
          <Outlet />
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Book Store System ©2025 Created by Ant Design
      </Footer>
    </Layout>
  );
}