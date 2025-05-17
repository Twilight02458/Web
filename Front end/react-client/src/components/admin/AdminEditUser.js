import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";

const AdminEditUser = ({ user, onSuccess }) => {
    const [form, setForm] = useState({ ...user });
    const [msg, setMsg] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        try {
            await authApis().post(endpoints['update-user'], form);
            setMsg("Cập nhật thành công!");
            if (onSuccess) onSuccess();
        } catch {
            setMsg("Cập nhật thất bại!");
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {msg && <Alert variant={msg.includes("thành công") ? "success" : "danger"}>{msg}</Alert>}
            <Form.Group className="mb-3">
                <Form.Label>Họ tên</Form.Label>
                <Form.Control value={form.firstName || ""} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="Họ" required />
                <Form.Control value={form.lastName || ""} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Tên" required className="mt-2" />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </Form.Group>
            <Button type="submit" variant="success">Lưu thay đổi</Button>
        </Form>
    );
};

export default AdminEditUser;