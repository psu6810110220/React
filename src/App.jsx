import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// 1. นำเข้าสิ่งที่จำเป็น
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useNavigate, 
  Outlet, 
  Navigate // <--- ตรวจสอบให้แน่ใจว่า import ถูกต้อง (ถ้าใช้ V6)
} from 'react-router-dom'; 


// 1. นำเข้าหน้าหลักทั้งหมด (ใน src/)
import LoginScreen from './LoginScreen.jsx';
import BookScreen from './BookScreen.jsx';
import CategoryScreen from './CategoryScreen.jsx';

// 2. นำเข้าไฟล์อื่นๆ components ใน src/components/
import AddBook from './components/AddBook.jsx';
import EditBook from './components/EditBook.jsx';
import AppLayout from './components/AppLayout.jsx';
import DashboardScreen from './components/BookStatsDashboard.jsx'; 
import ProtectedRoute from './components/ProtectedRoute.jsx'; // นำเข้า ProtectedRoute หากแยกไฟล์

// ตั้งค่า Axios
axios.defaults.baseURL = "http://localhost:3000";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    }
    return false;
  });

  const handleLoginSuccess = (token, remember) => {
    if (token) {
      if (remember) {
        localStorage.setItem('access_token', token);
      } else {
        sessionStorage.setItem('access_token', token);
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Route สำหรับ Login */}
        <Route path="/login" element={
          // ใช้ <Navigate> component เพื่อ redirect หาก login แล้ว
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginScreen onLoginSuccess={handleLoginSuccess} />
        } />

        {/* Protected Routes: ต้อง login ก่อนจึงจะเข้าถึงได้ */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<AppLayout onLogout={handleLogout} />}>
            
            {/* Dashboard เป็นหน้าแรกหลังจาก Login (path: /) หรือ path: /dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} /> 
            <Route path="/dashboard" element={<DashboardScreen />} /> 
            
            <Route path="/books" element={<BookScreen />} />
            <Route path="/books/add" element={<AddBook />} />
            <Route path="/books/edit/:id" element={<EditBook />} />
            <Route path="/categories" element={<CategoryScreen />} />

          </Route>
        </Route>

        {/* Route สำหรับ 404 Not Found */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;