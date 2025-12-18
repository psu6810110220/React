import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// 1. ลงทะเบียน (Register) องค์ประกอบ Chart ที่ต้องการใช้
// สิ่งนี้สำคัญมากสำหรับ Chart.js 3+
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 2. ข้อมูลสถิติ (Mock Data)
// สมมติว่านี่คือข้อมูลสถิติหนังสือในร้าน
const bookData = {
  labels: ['นิยาย', 'การ์ตูน', 'วิชาการ', 'ท่องเที่ยว', 'ชีวประวัติ'],
  datasets: [
    {
      label: 'จำนวนหนังสือในสต็อก',
      data: [150, 220, 85, 45, 110], // จำนวนหนังสือในแต่ละหมวดหมู่
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

// 3. ตัวเลือกการแสดงผล (Chart Options)
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top', // วางคำอธิบายไว้ด้านบน
    },
    title: {
      display: true,
      text: 'สถิติจำนวนหนังสือในคลังตามหมวดหมู่', // ชื่อแผนภูมิ
    },
  },
  scales: {
    y: {
      beginAtZero: true, // เริ่มแกน Y ที่ 0
      title: {
        display: true,
        text: 'จำนวนหนังสือ (เล่ม)',
      },
    },
    x: {
        title: {
            display: true,
            text: 'หมวดหมู่',
          },
      },
  },
};

// 4. คอมโพเนนต์ Dashboard
const BookStatsDashboard = () => {
  return (
    <div style={{ width: '80%', margin: '0 auto', padding: '20px' }}>
      <h1>📚 Book Store Inventory Dashboard</h1>
      <p>แสดงสถิติของหนังสือในร้านโดยใช้ **React Chart.js 2** (Bar Chart)</p>
      <div style={{ height: '400px' }}>
        {/* ใช้คอมโพเนนต์ Bar พร้อมส่ง options และ data เข้าไป */}
        <Bar options={chartOptions} data={bookData} />
      </div>
    </div>
  );
};

export default BookStatsDashboard;