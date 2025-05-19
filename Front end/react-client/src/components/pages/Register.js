import { useRef, useState } from "react";
import { Alert, Button, Col, Form } from "react-bootstrap";
import Apis, { endpoints } from "../../configs/Apis";
import MySpinner from "../layouts/MySpinner";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const info = [{
        label: "Tên",
        field: "firstName",
        type: "text"
    }, {
        label: "Họ và tên lót",
        field: "lastName",
        type: "text"
    }, {
        label: "Email",
        field: "email",
        type: "email"
    }, {
        label: "Điện thoại",
        field: "phone",
        type: "tel"
    }, {
        label: "Tên đăng nhập",
        field: "username",
        type: "text"
    }, {
        label: "Mật khẩu",
        field: "password",
        type: "password"
    }, {
        label: "Xác nhận mật khẩu",
        field: "confirm",
        type: "password"
    }];
    const avatar = useRef();

    const [user, setUser] = useState({});
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const validate = () => {
        if (!user.password || user.password !== user.confirm) {
            setMsg("Mật khẩu không khớp!");
            return false;
        }

        return true;
    }

    const register = async (e) => {
        e.preventDefault();

        if (validate()) {
            let form = new FormData();
            for (let key in user) 
                if (key !== 'confirm') {
                    form.append(key, user[key]);
                }

            if (avatar) {
                form.append('avatar', avatar.current.files[0]);
            }

            try {
                setLoading(true);
                let res = await Apis.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 201)
                    nav('/login');
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <>
            <h1 className="text-center text-success mt-2">ĐĂNG KÝ NGƯỜI DÙNG</h1>

            {msg && <Alert variant="danger" className="mt-1">{msg}</Alert>}

            <Form onSubmit={register}>
                {info.map(i =>  <Form.Group className="mb-3">
                    <Form.Control value={user[i.field]} onChange={e => setUser({...user, [i.field]: e.target.value})} type={i.type} placeholder={i.label} required />
                </Form.Group>)}

                <Form.Group className="mb-3">
                    <Form.Control ref={avatar} type="file" required />
                </Form.Group>

                <Form.Group className="mb-3">
                    {loading === true?<MySpinner />:<Button type="submit" variant="danger">Đăng ký</Button>}
                </Form.Group>
               
            </Form>
        </>
    );
}

export default Register;