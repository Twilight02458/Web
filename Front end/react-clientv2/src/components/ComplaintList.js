import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from '../axios';

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('/api/secure/admin/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách phản ánh!');
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await axios.put(`/api/secure/complaints/${complaintId}/update`, {
        status: newStatus
      });
      toast.success('Cập nhật trạng thái thành công!');
      fetchComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái!');
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
      <h2 className="mb-4">Danh sách phản ánh</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Người gửi</th>
            <th>Vị trí</th>
            <th>Mức độ ưu tiên</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.title}</td>
              <td>{complaint.userId.username}</td>
              <td>{complaint.location}</td>
              <td>{getPriorityBadge(complaint.priority)}</td>
              <td>{getStatusBadge(complaint.status)}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleViewDetails(complaint)}
                >
                  Chi tiết
                </Button>
                {complaint.status === 'pending' && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleStatusChange(complaint.id, 'processing')}
                    >
                      Xử lý
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusChange(complaint.id, 'rejected')}
                    >
                      Từ chối
                    </Button>
                  </>
                )}
                {complaint.status === 'processing' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusChange(complaint.id, 'resolved')}
                  >
                    Hoàn thành
                  </Button>
                )}
                {(complaint.status === 'resolved' || complaint.status === 'rejected') && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
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

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết phản ánh</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <div>
              <h4>{selectedComplaint.title}</h4>
              <p><strong>Người gửi:</strong> {selectedComplaint.userId.username}</p>
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
              <p><strong>Người gửi:</strong> {complaintToDelete.userId.username}</p>
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

export default ComplaintList; 