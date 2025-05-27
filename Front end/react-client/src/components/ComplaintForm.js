import React, { useState, useContext } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Form, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { MyUserContext } from '../configs/Contexts';

const ComplaintForm = () => {
  const user = useContext(MyUserContext);
  const [complaint, setComplaint] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const complaintsRef = collection(db, 'complaints');
      await addDoc(complaintsRef, {
        ...complaint,
        userId: user.id,
        userName: user.username,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      toast.success('Phản ánh đã được gửi thành công!');
      setComplaint({
        title: '',
        description: '',
        location: '',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Có lỗi xảy ra khi gửi phản ánh. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaint(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Gửi phản ánh</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tiêu đề</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={complaint.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề phản ánh"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mô tả chi tiết</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={complaint.description}
            onChange={handleChange}
            placeholder="Mô tả chi tiết vấn đề bạn muốn phản ánh"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Vị trí</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={complaint.location}
            onChange={handleChange}
            placeholder="Ví dụ: Tầng 5, Khu A, Chung cư..."
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mức độ ưu tiên</Form.Label>
          <Form.Select
            name="priority"
            value={complaint.priority}
            onChange={handleChange}
          >
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
            <option value="urgent">Khẩn cấp</option>
          </Form.Select>
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Đang gửi...' : 'Gửi phản ánh'}
        </Button>
      </Form>
    </div>
  );
};

export default ComplaintForm; 