import { useContext, useRef, useState } from "react";
import { Alert, Button, Col, Form, Card, Container, Row } from "react-bootstrap";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import MySpinner from "../layouts/MySpinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import cookie from "react-cookies";
import { MyDispatchContext } from "../../configs/Contexts";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

const Login = () => {
    const info = [{
        label: "Tên đăng nhập",
        field: "username",
        type: "text",
        icon: <FaUser className="me-2" />
    }, {
        label: "Mật khẩu",
        field: "password",
        type: "password",
        icon: <FaLock className="me-2" />
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

            cookie.save('token', token, {
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

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
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h2 className="text-primary fw-bold">ĐĂNG NHẬP</h2>
                                <p className="text-muted">Vui lòng đăng nhập để tiếp tục</p>
                            </div>

                            {msg && <Alert variant="danger" className="mt-3">{msg}</Alert>}

                            <Form onSubmit={login}>
                                {info.map(i => (
                                    <Form.Group className="mb-4" key={i.field}>
                                        <Form.Label className="text-muted">{i.label}</Form.Label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light">
                                                {i.icon}
                                            </span>
                                            <Form.Control
                                                value={user[i.field] || ""}
                                                onChange={e => setUser({ ...user, [i.field]: e.target.value })}
                                                type={i.type}
                                                placeholder={i.label}
                                                required
                                                className="form-control-lg"
                                            />
                                        </div>
                                    </Form.Group>
                                ))}
                                <Form.Group className="mb-3">
                                    {loading ? (
                                        <div className="d-grid">
                                            <MySpinner />
                                        </div>
                                    ) : (
                                        <div className="d-grid">
                                            <Button 
                                                type="submit" 
                                                variant="primary" 
                                                size="lg"
                                                className="fw-bold"
                                            >
                                                <FaSignInAlt className="me-2" />
                                                Đăng nhập
                                            </Button>
                                        </div>
                                    )}
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;