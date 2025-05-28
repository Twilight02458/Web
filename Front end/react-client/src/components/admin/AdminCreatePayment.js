import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Table, Card } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";

const AdminCreatePayment = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sentUsers, setSentUsers] = useState([]);
    const [items, setItems] = useState([{ feeType: "", amount: "" }]);
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await authApis().get(endpoints["users-list"]);
                setUsers(res.data);
            } catch (err) {
                setUsers([]);
            }
        };
        loadUsers();
    }, []);

    const handleItemChange = (idx, field, value) => {
        const newItems = [...items];
        newItems[idx][field] = value;
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { feeType: "", amount: "" }]);
    const removeItem = idx => setItems(items.filter((_, i) => i !== idx));

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setItems([{ feeType: "", amount: "" }]);
        setMsg(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        if (!selectedUser) {
            setMsg("Vui lòng chọn cư dân!");
            return;
        }
        try {
            const paymentRequest = {
                method: "BANK_TRANSFER",
                transactionCode: Date.now().toString(),
                items: items.filter(i => i.feeType && i.amount)
            };
           await authApis().post(endpoints['create-payment'](selectedUser.username), paymentRequest);
            setMsg("Tạo phiếu thanh toán thành công!");
            setSentUsers([...sentUsers, selectedUser.username]);
            setSelectedUser(null); // Ẩn form sau khi gửi
        } catch (err) {
            setMsg("Lỗi tạo phiếu: " + (err.response?.data || err.message));
        }
    };

    return (
        <div className="container mt-4 position-relative">
            <h3>Admin: Xuất phiếu thanh toán tổng hợp</h3>
            {msg && <Alert variant="info">{msg}</Alert>}

            <h5>Danh sách cư dân</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Họ tên</th>
                        <th>SĐT</th>
                        <th>Email</th>
                        <th>Chọn</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.lastName} {u.firstName}</td>
                            <td>{u.phone}</td>
                            <td>{u.email}</td>
                            <td>
                                <Button
                                    variant={sentUsers.includes(u.username) ? "success" : "primary"}
                                    size="sm"
                                    onClick={() => handleSelectUser(u)}
                                    disabled={sentUsers.includes(u.username)}
                                >
                                    {sentUsers.includes(u.username) ? "Đã gửi" : "Chọn"}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {selectedUser && (
                <div
                    style={{
                        position: "fixed",
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: "rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000
                    }}
                >
                    <Card style={{ minWidth: 400, maxWidth: 500 }}>
                        <Card.Body>
                            <h5 className="mb-3">Xuất phiếu cho cư dân</h5>
                            <Alert variant="secondary">
                                <b>{selectedUser.lastName} {selectedUser.firstName}</b> - {selectedUser.phone} - {selectedUser.email}
                            </Alert>
                            <Form onSubmit={handleSubmit}>
                                {items.map((item, idx) => (
                                    <div key={idx} className="mb-2 d-flex align-items-center">
                                        <Form.Control
                                            placeholder="Loại phí"
                                            value={item.feeType}
                                            onChange={e => handleItemChange(idx, "feeType", e.target.value)}
                                            required
                                            className="me-2"
                                        />
                                        <Form.Control
                                            placeholder="Số tiền"
                                            type="number"
                                            value={item.amount}
                                            onChange={e => handleItemChange(idx, "amount", e.target.value)}
                                            required
                                            min={1000}
                                            className="me-2"
                                        />
                                        <Button variant="danger" onClick={() => removeItem(idx)} disabled={items.length === 1}>X</Button>
                                    </div>
                                ))}
                                <Button variant="secondary" onClick={addItem} className="mb-3">+ Thêm loại phí</Button>
                                <br />
                                <Button type="submit" variant="primary">Xuất phiếu</Button>
                                <Button variant="outline-secondary" className="ms-2" onClick={() => setSelectedUser(null)}>Hủy</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdminCreatePayment;