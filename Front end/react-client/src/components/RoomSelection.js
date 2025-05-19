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
        { id: 'general', name: 'General Chat' },
        { id: 'support', name: 'Support' },
        { id: 'announcements', name: 'Announcements' },
        { id: 'help', name: 'Help & Questions' }
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
            <h1 className="text-center mb-4">Select a Chat Room</h1>
            
            <Row className="justify-content-center">
                <Col md={8}>
                    <div className="predefined-rooms mb-4">
                        <h3 className="mb-3">Available Rooms</h3>
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
                                                Join the {room.name.toLowerCase()} discussion
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    <div className="custom-room">
                        <h3 className="mb-3">Create/Join Custom Room</h3>
                        <Form onSubmit={handleCustomRoomSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter room name"
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
                                Create/Join Room
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default RoomSelection; 