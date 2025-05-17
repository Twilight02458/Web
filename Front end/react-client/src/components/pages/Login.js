import { useContext, useRef, useState } from "react";
import { Alert, Button, Col, Form } from "react-bootstrap";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import MySpinner from "../layouts/MySpinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import cookie from "react-cookies";
import { MyDispatchContext } from "../../configs/Contexts";

const Login = () => {
    const info = [{
        label: "Tên đăng nhập",
        field: "username",
        type: "text"
    }, {
        label: "Mật khẩu",
        field: "password",
        type: "password"
    }];

    const [user, setUser] = useState({});
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const dispatch = useContext(MyDispatchContext);
    const [q] = useSearchParams();


    const login = async (e) => {
        e.preventDefault();
        setMsg(null);
        try {
            setLoading(true);

            let res = await Apis.post(endpoints['login'], { ...user });
            let { token, passwordChanged, avatarUploaded } = res.data || {};

            if (!token) {
                setMsg("Tên đăng nhập hoặc mật khẩu không đúng!");
                return;
            }

            cookie.save('token', token);

            if (!passwordChanged || !avatarUploaded) {
                localStorage.setItem("firstLoginUsername", user.username);
                nav('/first-login');
                return;
            }

            let u = await authApis().get(endpoints['current-user']);
            dispatch({
                "type": "login",
                "payload": u.data
            });

            if (u.data.role === "ADMIN") {
                nav("/admin");
            } else {
                nav("/");
            }
        } catch (ex) {
            if (ex.response && ex.response.data) {
                if (typeof ex.response.data === "object" && ex.response.data.message) {
                    setMsg(ex.response.data.message);
                } else if (typeof ex.response.data === "string") {
                    setMsg(ex.response.data);
                } else {
                    setMsg("Đã xảy ra lỗi không xác định!");
                }
            } else {
                setMsg("Không thể kết nối tới máy chủ!");
            }
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className="text-center text-success mt-2">ĐĂNG NHẬP NGƯỜI DÙNG</h1>

            {msg && <Alert variant="danger" className="mt-1">{msg}</Alert>}

            <Form onSubmit={login}>
                {info.map(i => (
                    <Form.Group className="mb-3" key={i.field}>
                        <Form.Control
                            value={user[i.field] || ""}
                            onChange={e => setUser({ ...user, [i.field]: e.target.value })}
                            type={i.type}
                            placeholder={i.label}
                            required
                        />
                    </Form.Group>
                ))}
                <Form.Group className="mb-3">
                    {loading === true ? <MySpinner /> : <Button type="submit" variant="danger">Đăng nhập</Button>}
                </Form.Group>
            </Form>
        </>
    );
}

export default Login;