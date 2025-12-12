// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Import Components
import LoginScreen from './LoginScreen.jsx';
import BookScreen from './BookScreen.jsx';
import AddBook from './components/AddBook.jsx';
import EditBook from './components/EditBook.jsx';
import CategoryScreen from './CategoryScreen.jsx';
import AppLayout from './components/AppLayout.jsx'; // 1. ตรวจสอบว่ามีบรรทัดนี้

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';

axios.defaults.baseURL = "http://localhost:3000";

const ProtectedRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
};

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
      if (remember) localStorage.setItem('access_token', token);
      else localStorage.removeItem('access_token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/books" replace /> : <LoginScreen onLoginSuccess={handleLoginSuccess} />
          }
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            
            {/* 2. ใช้ AppLayout ครอบหนัาทำงานทั้งหมด เพื่อให้เมนูแสดงทุกหน้า */}
            <Route element={<AppLayout onLogout={handleLogout} />}>
                <Route path="/books" element={<BookScreen />} /> 
                <Route path="/books/add" element={<AddBook />} />
                <Route path="/books/edit/:id" element={<EditBook />} />
                <Route path="/categories" element={<CategoryScreen />} />
            </Route>

        </Route>

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;