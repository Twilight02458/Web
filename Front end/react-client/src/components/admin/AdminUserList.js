import { useEffect, useState } from "react";
import { Table, Button, Alert, Form, Modal } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import AdminEditUser from "./AdminEditUser"; // import component sửa user
import { useNavigate } from "react-router-dom";



const AdminUserList = () => {
    const nav = useNavigate();
    const [users, setUsers] = useState([]);
    const [msg, setMsg] = useState();
    const [kw, setKw] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const loadUsers = async () => {
        try {
            let res = await authApis().get(endpoints['users-list'], {
                params: {
                    page: 0,
                    size: 10,
                    keyword: kw
                }
            });
            setUsers(res.data);
        } catch {
            setMsg("Không thể tải danh sách cư dân!");
        }
    };

    useEffect(() => { loadUsers(); }, [kw]);

    const handleLock = async (id, active) => {
        try {
            if (active) {
                // Khoá tài khoản
                await authApis().post(
                    endpoints['deactivate-user'],
                    null,
                    { params: { userId: id } }
                );
            } else {
                // Mở khoá tài khoản
                await authApis().post(
                    endpoints['activate-user'],
                    null,
                    { params: { userId: id } }
                );
            }
            loadUsers();
        } catch {
            setMsg("Không thể cập nhật trạng thái!");
        }
    };

    // Thêm hàm mở modal sửa user
    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowEdit(true);
    };

    return (
        <div className="container mt-4">
            <h2>Danh sách cư dân</h2>
            {msg && <Alert variant="danger">{msg}</Alert>}
            <Form.Control
                placeholder="Tìm kiếm theo tên, email..."
                value={kw}
                onChange={e => setKw(e.target.value)}
                className="mb-3"
            />
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên đăng nhập</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, idx) => (
                        <tr key={u.id}>
                            <td>{idx + 1}</td>
                            <td>{u.username}</td>
                            <td>{u.firstName} {u.lastName}</td>
                            <td>{u.email}</td>
                            <td>{u.active ? "Hoạt động" : "Đã khoá"}</td>
                            <td>
                                <Button
                                    size="sm"
                                    variant={u.active ? "danger" : "success"}
                                    onClick={() => handleLock(u.id, u.active)}
                                    className="me-2"
                                >
                                    {u.active ? "Khoá" : "Mở khoá"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="warning"
                                    onClick={() => handleEdit(u)}
                                    className="me-2"
                                >
                                    Sửa
                                </Button>
                                <Button
                                    size="sm"
                                    variant="info"
                                    onClick={() => nav(`/admin/locker/${u.id}`)}
                                >
                                    Tủ đồ
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal sửa user */}
            <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật cư dân</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <AdminEditUser
                            user={selectedUser}
                            onSuccess={() => { setShowEdit(false); loadUsers(); }}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminUserList;