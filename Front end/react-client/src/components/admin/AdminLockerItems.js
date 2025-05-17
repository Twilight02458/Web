import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { Table, Button, Alert, Form } from "react-bootstrap";

const AdminLockerItems = () => {
    const { userId } = useParams();
    const [items, setItems] = useState([]);
    const [msg, setMsg] = useState(null);
    const [newItem, setNewItem] = useState({ itemName: "", status: "PENDING" });
    const [filter, setFilter] = useState("ALL");

    const loadItems = async () => {
        try {
            const res = await authApis().get(endpoints["user-lockers"], {
                params: { userId },
            });
            setItems(res.data);
        } catch {
            setMsg("Không thể tải danh sách tủ đồ!");
        }
    };

    useEffect(() => {
        loadItems();
    }, [userId]);

    const handleStatus = async (lockerId, status) => {
        const confirm = window.confirm("Bạn chắc chắn muốn đánh dấu là đã nhận?");
        if (!confirm) return;

        try {
            await authApis().post(endpoints["update-locker-status"], null, {
                params: { lockerId, status },
            });
            loadItems();
        } catch {
            setMsg("Không thể cập nhật trạng thái!");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await authApis().post(endpoints["add-locker-item"], {
                ...newItem,
                userId,
                receivedAt: new Date().toISOString(),
            });
            setNewItem({ itemName: "", status: "PENDING" });
            loadItems();
        } catch {
            setMsg("Không thể thêm tủ đồ!");
        }
    };

    const filteredItems = items.filter((item) => {
        if (filter === "ALL") return true;
        return item.status?.toUpperCase() === filter;
    });


    return (
        <div className="container mt-4">
            <h3>Quản lý tủ đồ của cư dân #{userId}</h3>
            {msg && <Alert variant="danger">{msg}</Alert>}

            <Form onSubmit={handleAdd} className="mb-3">
                <Form.Group className="mb-2">
                    <Form.Control
                        placeholder="Tên món hàng"
                        value={newItem.itemName}
                        onChange={(e) =>
                            setNewItem({ ...newItem, itemName: e.target.value })
                        }
                        required
                    />
                </Form.Group>

                <Button type="submit" variant="success">
                    Thêm vào tủ
                </Button>
            </Form>

            <Form.Group className="mb-3">
                <Form.Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="ALL">Tất cả</option>
                    <option value="PENDING">Chờ nhận</option>
                    <option value="RECEIVED">Đã nhận</option>
                </Form.Select>
            </Form.Group>

            <Table bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên món hàng</th>
                        <th>Ngày nhận</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredItems.map((item, idx) => (
                        <tr key={item.id}>
                            <td>{idx + 1}</td>
                            <td>{item.itemName}</td>
                            <td>
                                {item.receivedAt
                                    ? new Date(item.receivedAt).toLocaleString()
                                    : ""}
                            </td>
                            <td>
                                {item.status === "RECEIVED" ? "Đã nhận" : "Chờ nhận"}
                            </td>
                            <td>
                                {item.status !== "RECEIVED" && (
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() =>
                                            handleStatus(item.id, "RECEIVED")
                                        }
                                    >
                                        Đánh dấu đã nhận
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default AdminLockerItems;
