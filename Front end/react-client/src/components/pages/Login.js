<<<<<<< HEAD
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setError(""); // Xóa thông báo lỗi khi người dùng thay đổi thông tin
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = credentials;

    // Kiểm tra thông tin đăng nhập
    if (username === "123" && password === "123") {
      // Đăng nhập thành công, chuyển hướng đến trang Home
      navigate("/");
    } else {
      // Đăng nhập thất bại, hiển thị thông báo lỗi
      setError("Sai tên đăng nhập hoặc mật khẩu.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow">
            <Card.Body>
              <h2 className="mb-4 text-center">Đăng nhập</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Tên người dùng</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Nhập tên người dùng"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Nhập mật khẩu"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Đăng nhập
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
=======
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
>>>>>>> a18e969 (Add Chat)
