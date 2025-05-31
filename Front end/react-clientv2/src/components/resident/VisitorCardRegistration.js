import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Table, Alert, Modal } from 'react-bootstrap';
import { MyUserContext } from '../../configs/Contexts';
import { authApis, endpoints } from '../../configs/Apis';
import { toast } from 'react-toastify';

const VisitorCardRegistration = () => {
    const [visitorCards, setVisitorCards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = useContext(MyUserContext);

    const [formData, setFormData] = useState({
        full_name: '',
        id_number: '',
        relationship: ''
    });

    const relationships = [
        'Spouse',
        'Child',
        'Parent',
        'Sibling',
        'Other Family Member'
    ];

    useEffect(() => {
        loadVisitorCards();
    }, []);

    const loadVisitorCards = async () => {
        try {
            setLoading(true);
            const response = await authApis().get(endpoints['visitor-cards']);
            setVisitorCards(response.data);
        } catch (error) {
            setError('Failed to load visitor cards');
            console.error('Error loading visitor cards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);
            const response = await authApis().post(endpoints['visitor-cards'], formData);
            
            // Add the new card to the list
            setVisitorCards(prev => [...prev, response.data]);
            
            // Reset form and close modal
            setFormData({
                full_name: '',
                id_number: '',
                relationship: ''
            });
            setShowModal(false);
            
            toast.success('Visitor card registered successfully!');
        } catch (error) {
            setError('Failed to register visitor card');
            console.error('Error registering visitor card:', error);
            toast.error('Failed to register visitor card');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (cardId) => {
        if (!window.confirm('Are you sure you want to delete this visitor card?')) {
            return;
        }

        try {
            setLoading(true);
            await authApis().delete(`${endpoints['visitor-cards']}${cardId}/`);
            setVisitorCards(prev => prev.filter(card => card.id !== cardId));
            toast.success('Visitor card deleted successfully!');
        } catch (error) {
            setError('Failed to delete visitor card');
            console.error('Error deleting visitor card:', error);
            toast.error('Failed to delete visitor card');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="visitor-card-registration">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Visitor Card Registration</h2>
                <Button 
                    variant="primary" 
                    onClick={() => setShowModal(true)}
                    disabled={loading}
                >
                    Register New Visitor Card
                </Button>
            </div>

            {error && (
                <Alert variant="danger" className="mb-3">
                    {error}
                </Alert>
            )}

            {loading && (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>ID Number</th>
                        <th>Relationship</th>
                        <th>Registered At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {visitorCards.map(card => (
                        <tr key={card.id}>
                            <td>{card.full_name}</td>
                            <td>{card.id_number}</td>
                            <td>{card.relationship}</td>
                            <td>{new Date(card.Registed_at).toLocaleString()}</td>
                            <td>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(card.id)}
                                    disabled={loading}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {visitorCards.length === 0 && !loading && (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No visitor cards registered yet
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Register New Visitor Card</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter full name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>ID Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="id_number"
                                value={formData.id_number}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter ID number"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Relationship</Form.Label>
                            <Form.Select
                                name="relationship"
                                value={formData.relationship}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select relationship</option>
                                {relationships.map(rel => (
                                    <option key={rel} value={rel}>
                                        {rel}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button 
                                variant="secondary" 
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                variant="primary"
                                disabled={loading}
                            >
                                Register
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default VisitorCardRegistration; 