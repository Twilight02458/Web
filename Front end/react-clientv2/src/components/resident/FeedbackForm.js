import { useState } from 'react';
import { authApis, endpoints } from "../../configs/Apis";
import { Alert, Form, Button } from "react-bootstrap";

export default function FeedbackForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authApis().post(endpoints["user-feedback"], { title, content });
            setMessage('Phản ánh của bạn đã được gửi.');
            setTitle('');
            setContent('');
        } catch (error) {
            setMessage('Gửi phản ánh thất bại.');
        }
    };

    return (
        <div className="container mt-4">
            <h3>Gửi phản ánh đến Ban Quản Trị</h3>
            {message && <Alert variant="info">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Tiêu đề</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Nội dung phản ánh</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button type="submit" variant="primary">Gửi phản ánh</Button>
            </Form>
        </div>
    );
} 