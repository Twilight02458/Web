import { useState, useContext, useEffect } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/Contexts";

const ResidentPayment = () => {
    const user = useContext(MyUserContext);
    const [payments, setPayments] = useState([]);
    const [msg, setMsg] = useState();

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await authApis().get(endpoints["user-payment"]);
                console.log("Payments:", res.data);
                setPayments(res.data);
            } catch (err) {
                setMsg("Không thể lấy danh sách các phiếu thanh toán!");
            }
        };
        fetchPayments();
    }, []);

    const handlePayment = async (transactionCode) => {
        setMsg(null);
        try {
            const res = await authApis().post(
                `${endpoints["payment-create"]}?transactionCode=${transactionCode}`
            );
            window.location.href = res.data;
        } catch (err) {
            setMsg("Không thể tạo giao dịch thanh toán!");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Danh sách phiếu thanh toán của bạn</h3>
            {msg && <Alert variant="danger">{msg}</Alert>}

            {payments.length === 0 ? (
                <Alert variant="info">Không có phiếu thanh toán nào.</Alert>
            ) : (
                payments.map((payment, index) => {
                    const total = payment.items?.reduce(
                        (sum, item) => sum + (item.amount || 0),
                        0
                    );
                    return (
                        <div key={payment.id} className="mb-4 p-3 border rounded">
                            <h5>
                                Phiếu thanh toán #{index + 1} - Mã:{" "}
                                {payment.transactionCode}
                            </h5>
                            <Table striped bordered>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Loại phí</th>
                                        <th>Số tiền (VNĐ)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payment.items?.map((item, idx) => (
                                        <tr key={item.id || idx}>
                                            <td>{idx + 1}</td>
                                            <td>{item.feeType}</td>
                                            <td>{item.amount?.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={2}>
                                            <b>Tổng cộng</b>
                                        </td>
                                        <td>
                                            <b>{total.toLocaleString()}</b>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>

                            <Button
                                variant="success"
                                onClick={() =>
                                    handlePayment(payment.transactionCode)
                                }
                                disabled={payment.status === "APPROVED"}
                            >
                                {payment.status === "APPROVED"
                                    ? "Đã thanh toán"
                                    : "Thanh toán qua VNPay"}
                            </Button>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ResidentPayment;
