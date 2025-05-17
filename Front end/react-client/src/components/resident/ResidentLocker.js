import { useEffect, useState, useContext } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Table, Alert } from "react-bootstrap";
import { MyUserContext } from "../../configs/Contexts"; 

const ResidentLocker = () => {
    const user = useContext(MyUserContext);
    const [items, setItems] = useState([]);
    const [msg, setMsg] = useState();

    useEffect(() => {
        const loadItems = async () => {
            try {
                // Lấy locker của user hiện tại
                let res = await authApis().get(endpoints["locker"], {
                    params: { userId: user.id }
                });
                setItems(res.data);
            } catch {
                setMsg("Không thể tải danh sách tủ đồ!");
            }
        };
        if (user) loadItems();
    }, [user]);

    return (
        <div className="container mt-4">
            <h3>Tủ đồ của bạn</h3>
            {msg && <Alert variant="danger">{msg}</Alert>}
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên món hàng</th>
                        <th>Ngày nhận</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
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
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ResidentLocker;