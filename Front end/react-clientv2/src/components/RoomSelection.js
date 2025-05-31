import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import '../styles/RoomSelection.css';

const RoomSelection = () => {
    const [selectedRoom, setSelectedRoom] = useState('');
    const [customRoom, setCustomRoom] = useState('');
    const navigate = useNavigate();

    // Predefined rooms
    const predefinedRooms = [
        { id: 'general', name: 'Phòng chung' },
        { id: 'support', name: 'Hỗ trợ' },
        { id: 'announcements', name: 'Thông báo' },
        { id: 'help', name: 'Hỏi đáp' }
    ];

    const handleRoomSelect = (roomId) => {
        setSelectedRoom(roomId);
        setCustomRoom('');
    };

    const handleCustomRoomSubmit = (e) => {
        e.preventDefault();
        if (customRoom.trim()) {
            navigate(`/chat/${customRoom.trim().toLowerCase().replace(/\s+/g, '-')}`);
        }
    };

    const handlePredefinedRoomSelect = (roomId) => {
        navigate(`/chat/${roomId}`);
    };

    return (
        <Container className="room-selection-container">
            <h1 className="text-center mb-4">Chọn phòng chat</h1>
            
            <Row className="justify-content-center">
                <Col md={8}>
                    <div className="predefined-rooms mb-4">
                        <h3 className="mb-3">Các phòng có sẵn</h3>
                        <Row>
                            {predefinedRooms.map((room) => (
                                <Col key={room.id} md={6} className="mb-3">
                                    <Card 
                                        className={`room-card ${selectedRoom === room.id ? 'selected' : ''}`}
                                        onClick={() => handlePredefinedRoomSelect(room.id)}
                                    >
                                        <Card.Body>
                                            <Card.Title>{room.name}</Card.Title>
                                            <Card.Text>
                                                Tham gia thảo luận {room.name.toLowerCase()}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    <div className="custom-room">
                        <h3 className="mb-3">Tạo/Tham gia phòng riêng</h3>
                        <Form onSubmit={handleCustomRoomSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tên phòng"
                                    value={customRoom}
                                    onChange={(e) => setCustomRoom(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={!customRoom.trim()}
                            >
                                Tạo/Tham gia phòng
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default RoomSelection; 