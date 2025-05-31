import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { authApis, endpoints } from '../../configs/Apis';
import './Complaints.css';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = async () => {
        try {
            const response = await authApis().get(endpoints['complaints']);
            setComplaints(response.data);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.status === 404 
                ? 'No complaints found' 
                : 'Failed to load complaints';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authApis().post(endpoints['complaints'], formData);
            if (response.status === 201) {
                toast.success('Complaint submitted successfully');
                setShowModal(false);
                setFormData({ title: '', description: '' });
                loadComplaints();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to submit complaint';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (id) => {
        try {
            const response = await authApis().get(`${endpoints['complaint-detail']}/${id}`);
            if (response.data) {
                setSelectedComplaint(response.data);
            } else {
                toast.error('Complaint not found');
            }
        } catch (err) {
            if (err.response?.status === 404) {
                toast.error('Complaint not found');
            } else {
                toast.error('Failed to load complaint details');
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Complaints Management</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    New Complaint
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">No complaints found</td>
                        </tr>
                    ) : (
                        complaints.map(complaint => (
                            <tr key={complaint.id}>
                                <td>{complaint.id}</td>
                                <td>{complaint.title}</td>
                                <td>{complaint.description}</td>
                                <td>{complaint.status || 'PENDING'}</td>
                                <td>
                                    <Button 
                                        variant="info" 
                                        size="sm" 
                                        className="me-2"
                                        onClick={() => handleView(complaint.id)}
                                    >
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {/* New Complaint Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>New Complaint</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* View Complaint Modal */}
            <Modal show={!!selectedComplaint} onHide={() => setSelectedComplaint(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Complaint Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedComplaint && (
                        <>
                            <h5>{selectedComplaint.title}</h5>
                            <p>{selectedComplaint.description}</p>
                            <p><strong>Status:</strong> {selectedComplaint.status || 'PENDING'}</p>
                            <p><strong>Created At:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Complaints; 