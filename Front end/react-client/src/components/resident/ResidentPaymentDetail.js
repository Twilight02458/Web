import { useEffect, useState } from "react";
import { Table, Alert } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";

const ResidentPaymentDetail = () => {
    const [payments, setPayments] = useState([]);
    const [msg, setMsg] = useState();

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                // Log token và endpoint để debug
                const token = localStorage.getItem("access_token");
                console.log("Token hiện tại:", token);
                console.log("Endpoint:", endpoints["user-paymentdetail"]);

                const res = await authApis().get(endpoints["user-paymentdetail"]);
                setPayments(res.data);
            } catch (err) {
                // Log toàn bộ lỗi để debug
                console.error("Lỗi khi gọi API:", err);
                if (err.response) {
                    console.error("Response data:", err.response.data);
                    console.error("Response status:", err.response.status);
                    console.error("Response headers:", err.response.headers);
                    if (err.response.status === 401) {
                        setMsg("Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!");
                        // window.location = "/login"; // Bỏ comment nếu muốn tự động chuyển hướng
                        return;
                    }
                }
                setMsg("Không thể tải đơn thanh toán đã duyệt!");
            }
        };
        fetchPayments();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Đơn thanh toán đã hoàn thành</h2>
            {msg && <Alert variant="danger">{msg}</Alert>}

            {payments.length === 0 ? (
                <Alert variant="info">Bạn chưa có đơn thanh toán nào đã hoàn thành.</Alert>
            ) : (
                payments.map((payment, idx) => (
                    <div key={payment.id} className="mb-4 p-3 border rounded">
                        <h5>
                            Đơn #{idx + 1} - Mã giao dịch: {payment.transactionCode}
                        </h5>
                        <div>Ngày thanh toán: {new Date(payment.paymentDate).toLocaleString()}</div>
                        <div>Trạng thái: <b>{payment.status === "APPROVED" ? "Đã thanh toán" : payment.status}</b></div>
                        <Table striped bordered className="mt-2">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Loại phí</th>
                                    <th>Số tiền (VNĐ)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payment.items.map((item, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{item.feeType}</td>
                                        <td>{item.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={2}><b>Tổng cộng</b></td>
                                    <td><b>{payment.totalAmount.toLocaleString()}</b></td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                ))
            )}
        </div>
    );
};

export default ResidentPaymentDetail;