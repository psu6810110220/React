import React from 'react';
import { Table, Button, Space, Popconfirm, Tag, Image } from 'antd';
import { LikeOutlined } from '@ant-design/icons';

// URL หลักของ Backend
const BASE_URL = "http://localhost:3000";

const columns = (onLiked, onDelete, onEdit, onAskAI) => [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: 150,
  },
  {
    title: 'Author',
    dataIndex: 'author',
    key: 'author',
    width: 120,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    width: 100,
    render: (val) => val ? `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-',
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
    key: 'stock',
    width: 80,
    align: 'center',
    render: (stock) => (
      <span style={{ color: stock === 0 ? 'red' : 'inherit' }}>{stock}</span>
    ),
  },
  {
    title: 'Cover',
    dataIndex: 'coverurl',
    key: 'cover',
    width: 100,
    align: 'center',
    render: (url) => {
      let fullUrl = null;
      if (url) {
        if (url.startsWith("http")) {
          fullUrl = url;
        } else {
          // ✅ ไม้ตาย: ดึงมาแค่ชื่อไฟล์ เช่น "dune.jpg"
          const filename = url.split('/').pop(); 
          fullUrl = `${BASE_URL}/${filename}`;
        }
      }
      return (
        <Image
          width={60}
          src={fullUrl}
          alt="cover"
          fallback="https://placehold.co/60x80/EEEEEE/333333?text=No+Img"
          style={{ objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd', height: '80px' }}
        />
      );
    },
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    width: 120,
    render: (cat) => <Tag color="blue">{cat?.name || 'Uncategorized'}</Tag>
  },
  {
    title: 'Liked',
    dataIndex: 'likeCount',
    key: 'likeCount',
    align: 'center',
    width: 80,
    render: (val) => val || 0
  },
  {
    title: 'Action',
    key: 'action',
    width: 250,
    align: 'center',
    render: (_, record) => (
      <Space size="small">
        <Button 
            size="small" 
            style={{ borderColor: '#722ed1', color: '#722ed1' }} 
            onClick={() => onAskAI(record)}
        >
            AI
        </Button>
        <Button size="small" icon={<LikeOutlined />} onClick={() => onLiked(record)}>Like</Button>
        <Button size="small" onClick={() => onEdit(record)}>Edit</Button>
        <Popconfirm
          title="ลบหนังสือเล่มนี้?"
          onConfirm={() => onDelete(record.id)}
          okText="ลบ"
          cancelText="ยกเลิก"
        >
          <Button size="small" danger>Delete</Button>
        </Popconfirm>
      </Space>
    ),
  },
];

export default function BookList({ data, onLiked, onDelete, onEdit, onAskAI }) {
  return (
    <Table
      columns={columns(onLiked, onDelete, onEdit, onAskAI)}
      dataSource={data}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      bordered
    />
  );
}