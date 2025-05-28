import { useRef, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";

const AdminRegister = () => {
    const [user, setUser] = useState({});
    const avatar = useRef();
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);

        let form = new FormData();
        for (let key in user) {
            form.append(key, user[key]);
        }
        if (avatar.current && avatar.current.files[0]) {
            form.append("avatar", avatar.current.files[0]);
        }

        try {
            setLoading(true);
            let res = await authApis().post(endpoints['register-account'], form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.status === 201) {
                setMsg("Tạo tài khoản thành công!");
                setUser({});
                if (avatar.current) avatar.current.value = "";
            }
        } catch (err) {       
                setMsg("Có lỗi xảy ra khi tạo tài khoản!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center text-primary">Quản trị viên - Cấp phát tài khoản cư dân</h2>
            {msg && <Alert variant={msg.includes("thành công") ? "success" : "danger"}>{msg}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Tên đăng nhập</Form.Label>
                    <Form.Control required value={user.username || ""} onChange={e => setUser({ ...user, username: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control required type="password" value={user.password || ""} onChange={e => setUser({ ...user, password: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control required type="email" value={user.email || ""} onChange={e => setUser({ ...user, email: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control value={user.phone || ""} onChange={e => setUser({ ...user, phone: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Họ</Form.Label>
                    <Form.Control value={user.firstName || ""} onChange={e => setUser({ ...user, firstName: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Tên</Form.Label>
                    <Form.Control value={user.lastName || ""} onChange={e => setUser({ ...user, lastName: e.target.value })} />
                </Form.Group>
                <Button type="submit" variant="success" disabled={loading} className="mb-4">
                    {loading ? "Đang xử lý..." : "Tạo tài khoản"}
                </Button>
            </Form>
        </div>
    );
};

export default AdminRegister;