import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import cookie from "react-cookies";

const FirstLogin = () => {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);

        if (password !== confirm) {
            setMsg("Mật khẩu xác nhận không khớp!");
            return;
        }
        if (!avatar) {
            setMsg("Vui lòng chọn ảnh đại diện!");
            return;
        }

        try {
            setLoading(true);
            // Đổi mật khẩu
            await authApis().post(endpoints["change-password"], { newPassword: password });

            // Đăng nhập lại để lấy token mới
            const username = localStorage.getItem("firstLoginUsername");
            let loginRes = await Apis.post(endpoints['login'], {
                username: username,
                password: password
            });
            let { token } = loginRes.data || {};
            if (token) {
                cookie.save('token', token);
            } else {
                setMsg("Đăng nhập lại thất bại sau khi đổi mật khẩu!");
                setLoading(false);
                return;
            }

            // Upload avatar
            const formData = new FormData();
            formData.append("avatar", avatar);
            await authApis().post(endpoints["upload-avatar"], formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setMsg("Hoàn thành!");
            let u = await authApis().get(endpoints['current-user']);
            setTimeout(() => {
                if (u.data.role === "ADMIN") {
                    nav("/admin");
                } else {
                    nav("/");
                }
            }, 1500);
        } catch (err) {
            setMsg("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center text-primary">Đổi mật khẩu & Upload Avatar</h2>
            {msg && <Alert variant={msg.startsWith("Hoàn thành") ? "success" : "danger"}>{msg}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                    <Form.Control
                        type="password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Chọn ảnh đại diện</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={e => setAvatar(e.target.files[0])}
                        required
                    />
                </Form.Group>
                <Button type="submit" variant="success" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Xác nhận"}
                </Button>
            </Form>
        </div>
    );
};

export default FirstLogin;