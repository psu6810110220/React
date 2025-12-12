import { useState } from 'react';
import { Button, Form, Input, Alert, Checkbox } from 'antd'; // 1. import Checkbox เพิ่ม
import axios from 'axios';

const URL_AUTH = "/api/auth/login";

export default function LoginScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true);
      setErrMsg(null);

      // 1. ยิง Login
      const response = await axios.post(URL_AUTH, {
        username: formData.username,
        password: formData.password
      });
      
      const token = response.data.access_token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 2. ส่ง token และค่า remember (true/false) ไปที่ App.js
      // formData.remember จะเป็น true ถ้าติ๊ก, undefined/false ถ้าไม่ติ๊ก
      props.onLoginSuccess(token, formData.remember); 

    } catch (err) {
      console.log(err);
      setErrMsg(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      onFinish={handleLogin}
      autoComplete="off"
      layout="vertical"
      style={{ maxWidth: 400, margin: '50px auto' }}
      // ตั้งค่าเริ่มต้นให้ Remember Me เป็น false (ไม่ติ๊ก)
      initialValues={{ remember: false }} 
    >
      {errMsg && (
        <Form.Item>
          <Alert message={errMsg} type="error" showIcon />
        </Form.Item>
      )}

      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      {/* 3. เพิ่มปุ่ม Checkbox Remember Me */}
      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Remember Me</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}