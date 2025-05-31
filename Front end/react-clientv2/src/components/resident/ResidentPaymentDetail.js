import { useState, useEffect } from "react";
import { Alert, Card, Table } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import { FaReceipt } from "react-icons/fa";

const ResidentPaymentDetail = () => {
    const [payments, setPayments] = useState([]);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await authApis().get(endpoints["user-paymentdetail"]);
                setPayments(res.data);
            } catch (error) {
                setMsg("Không thể tải đơn thanh toán đã duyệt!");
            }
        };
        fetchPayments();
    }, []);

    return (
        <div className="container py-4">
            <Card className="shadow-sm border-0">
                <Card.Body>
                    <div className="d-flex align-items-center mb-4">
                        <FaReceipt className="text-primary me-2" size={24} />
                        <h2 className="h3 mb-0">Đơn thanh toán đã hoàn thành</h2>
                    </div>

                    {msg && <Alert variant="danger">{msg}</Alert>}

                    {payments.length === 0 ? (
                        <Alert variant="info">Bạn chưa có đơn thanh toán nào đã hoàn thành.</Alert>
                    ) : (
                        payments.map((payment, idx) => (
                            <Card key={payment.id} className="mb-4 border-0 shadow-sm">
                                <Card.Body>
                                    <h5 className="h6 mb-3">
                                        Đơn #{idx + 1} - Mã giao dịch:{" "}
                                        <span className="text-primary">{payment.transactionCode}</span>
                                    </h5>
                                    <div className="mb-3">
                                        <span className="badge bg-success me-2">
                                            {payment.status === "APPROVED" ? "Đã thanh toán" : payment.status}
                                        </span>
                                        <small className="text-muted">
                                            Ngày thanh toán: {new Date(payment.paymentDate).toLocaleString()}
                                        </small>
                                    </div>
                                    <Table striped bordered hover>
                                        <thead className="table-light">
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
                                                    <td>{item.amount?.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            <tr className="table-light">
                                                <td colSpan={2}>
                                                    <b>Tổng cộng</b>
                                                </td>
                                                <td>
                                                    <b>{payment.totalAmount.toLocaleString()}</b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default ResidentPaymentDetail;