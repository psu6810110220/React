import { Table, Button, Space, Popconfirm, Tag, Image } from 'antd';

export default function BookList({ data, onLiked, onDeleted, onEdit, onAskAi }) {

  const columns = [
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
      render: (val) => val ? `${Number(val).toLocaleString()} ฿` : '-'
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
      align: 'center',
      render: (stock) => <span style={{ color: stock === 0 ? 'red' : 'inherit' }}>{stock}</span>
    },
    {
      title: 'Cover',
      dataIndex: 'coverUrl', 
      key: 'cover',
      align: 'center',
      width: 100,
      render: (url) => {
        if (!url) return <Tag>No Image</Tag>;
        
        let fullUrl = url;
        if (!url.startsWith('http')) {
             // ใช้ Backtick ` ` (กดปุ่มตัวหนอน) เท่านั้น ห้ามใช้ ' '
             fullUrl = `http://localhost:3000/${url}`;
        }
        
        return (
           <Image 
             width={60}
             src={fullUrl} 
             alt="cover"
             // ใช้ placehold.co (ไม่มี r) เป็นเว็บที่ถูกต้อง
             fallback="https://placehold.co/60x90?text=No+Img"
             style={{ objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
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
      width: 280, 
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button 
             size="small"
             style={{ borderColor: '#722ed1', color: '#722ed1' }} 
             onClick={() => onAskAi(record)}
          >
             ✨ AI
          </Button>

          <Button size="small" type="default" onClick={() => onLiked(record)}>
             Like
          </Button>
          
          <Button size="small" onClick={() => onEdit(record)}>
             Edit
          </Button>
          
          <Popconfirm 
            title="ลบหนังสือเล่มนี้?"
            description="คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้"
            onConfirm={() => onDeleted(record.id)}
            okText="ลบ"
            cancelText="ยกเลิก"
          >
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id"
        pagination={{pageScreen: 10}} 
        bordered
    />
  );
}