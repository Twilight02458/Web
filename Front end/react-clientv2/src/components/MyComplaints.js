import React, { useState, useEffect, useContext } from 'react';
import { Table, Badge, Button, Modal } from 'react-bootstrap';
import { MyUserContext } from '../configs/Contexts';
import { toast } from 'react-toastify';
import axios from '../axios';

const MyComplaints = () => {
  const user = useContext(MyUserContext);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    fetchComplaints();
  }, [user]);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`/api/secure/complaints/user/${user.id}`);
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách phản ánh!');
    }
  };

  const handleDelete = async () => {
    if (!complaintToDelete) return;

    try {
      await axios.delete(`/api/secure/complaints/${complaintToDelete.id}`);
      toast.success('Đã xóa phản ánh thành công!');
      setShowDeleteModal(false);
      setComplaintToDelete(null);
      fetchComplaints();
    } catch (error) {
      console.error('Error deleting complaint:', error);
      toast.error('Có lỗi xảy ra khi xóa phản ánh!');
    }
  };

  const confirmDelete = (complaint) => {
    setComplaintToDelete(complaint);
    setShowDeleteModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'Chờ xử lý' },
      processing: { variant: 'info', text: 'Đang xử lý' },
      resolved: { variant: 'success', text: 'Đã xử lý' },
      rejected: { variant: 'danger', text: 'Từ chối' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { variant: 'secondary', text: 'Thấp' },
      medium: { variant: 'primary', text: 'Trung bình' },
      high: { variant: 'warning', text: 'Cao' },
      urgent: { variant: 'danger', text: 'Khẩn cấp' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Phản ánh của tôi</h2>
      {complaints.length === 0 ? (
        <div className="text-center p-4">
          <p>Bạn chưa có phản ánh nào.</p>
          <Button as="a" href="/submit-complaint" variant="primary">
            Gửi phản ánh mới
          </Button>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Vị trí</th>
              <th>Mức độ ưu tiên</th>
              <th>Trạng thái</th>
              <th>Thời gian gửi</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>{complaint.title}</td>
                <td>{complaint.location}</td>
                <td>{getPriorityBadge(complaint.priority)}</td>
                <td>{getStatusBadge(complaint.status)}</td>
                <td>{new Date(complaint.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleViewDetails(complaint)}
                  >
                    Chi tiết
                  </Button>
                  {(complaint.status === 'resolved' || complaint.status === 'rejected') && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => confirmDelete(complaint)}
                    >
                      Xóa
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết phản ánh</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <div>
              <h4>{selectedComplaint.title}</h4>
              <p><strong>Vị trí:</strong> {selectedComplaint.location}</p>
              <p><strong>Mức độ ưu tiên:</strong> {getPriorityBadge(selectedComplaint.priority)}</p>
              <p><strong>Trạng thái:</strong> {getStatusBadge(selectedComplaint.status)}</p>
              <p><strong>Mô tả:</strong></p>
              <p>{selectedComplaint.description}</p>
              <p><strong>Thời gian gửi:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
              <p><strong>Cập nhật lần cuối:</strong> {new Date(selectedComplaint.updatedAt).toLocaleString()}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa phản ánh này không?</p>
          {complaintToDelete && (
            <div>
              <p><strong>Tiêu đề:</strong> {complaintToDelete.title}</p>
              <p><strong>Trạng thái:</strong> {getStatusBadge(complaintToDelete.status)}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyComplaints; 