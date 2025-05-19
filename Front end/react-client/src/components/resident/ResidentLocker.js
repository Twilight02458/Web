import { useEffect, useState, useContext } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Table, Alert, Button, Modal, Form } from "react-bootstrap";
import { MyUserContext } from "../../configs/Contexts"; 
import { notificationService } from "../../services/NotificationService";
import { FaBell, FaBellSlash } from "react-icons/fa";
import cookie from "react-cookies";

const ResidentLocker = () => {
    const user = useContext(MyUserContext);
    const [items, setItems] = useState([]);
    const [msg, setMsg] = useState();
    const [showNotificationSettings, setShowNotificationSettings] = useState(false);
    const [notificationPreferences, setNotificationPreferences] = useState({
        pushEnabled: true,
        smsEnabled: false,
        phoneNumber: ""
    });
    const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);

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

        const loadNotificationPreferences = async () => {
            setIsLoadingPreferences(true);
            try {
                const token = cookie.load('token');
                if (!token) {
                    console.error("No token found");
                    return;
                }

                const res = await authApis().get(endpoints["notification-preferences"]);
                if (res.data) {
                    setNotificationPreferences(res.data);
                }
            } catch (error) {
                console.error("Error loading notification preferences:", error);
                // Set default preferences if there's an error
                setNotificationPreferences({
                    pushEnabled: true,
                    smsEnabled: false,
                    phoneNumber: ""
                });
            } finally {
                setIsLoadingPreferences(false);
            }
        };

        const initializeNotifications = async () => {
            if (notificationPreferences.pushEnabled) {
                try {
                    await notificationService.initializeMessaging();
                } catch (error) {
                    console.error("Error initializing notifications:", error);
                    setMsg("Không thể khởi tạo thông báo đẩy!");
                }
            }
        };

        if (user) {
            loadItems();
            loadNotificationPreferences();
            initializeNotifications();
        }
    }, [user, notificationPreferences.pushEnabled]);

    const handleNotificationSettingsSave = async () => {
        try {
            const token = cookie.load('token');
            if (!token) {
                setMsg("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
                return;
            }

            await authApis().post(endpoints["update-notification-preferences"], notificationPreferences);
            setShowNotificationSettings(false);
            setMsg("Cài đặt thông báo đã được cập nhật!");
            
            // Reinitialize notifications if push is enabled
            if (notificationPreferences.pushEnabled) {
                await notificationService.initializeMessaging();
            }
        } catch (error) {
            console.error("Error updating notification preferences:", error);
            setMsg("Không thể cập nhật cài đặt thông báo!");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Tủ đồ của bạn</h3>
                <Button 
                    variant="outline-primary"
                    onClick={() => setShowNotificationSettings(true)}
                    disabled={isLoadingPreferences}
                >
                    {notificationPreferences.pushEnabled ? <FaBell /> : <FaBellSlash />}
                    Cài đặt thông báo
                </Button>
            </div>

            {msg && <Alert variant="info">{msg}</Alert>}
            
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

            {/* Notification Settings Modal */}
            <Modal show={showNotificationSettings} onHide={() => setShowNotificationSettings(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cài đặt thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Check 
                                type="switch"
                                id="push-notification"
                                label="Bật thông báo đẩy"
                                checked={notificationPreferences.pushEnabled}
                                onChange={(e) => setNotificationPreferences({
                                    ...notificationPreferences,
                                    pushEnabled: e.target.checked
                                })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check 
                                type="switch"
                                id="sms-notification"
                                label="Bật thông báo SMS"
                                checked={notificationPreferences.smsEnabled}
                                onChange={(e) => setNotificationPreferences({
                                    ...notificationPreferences,
                                    smsEnabled: e.target.checked
                                })}
                            />
                        </Form.Group>
                        {notificationPreferences.smsEnabled && (
                            <Form.Group className="mb-3">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Nhập số điện thoại"
                                    value={notificationPreferences.phoneNumber}
                                    onChange={(e) => setNotificationPreferences({
                                        ...notificationPreferences,
                                        phoneNumber: e.target.value
                                    })}
                                />
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowNotificationSettings(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleNotificationSettingsSave}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ResidentLocker;