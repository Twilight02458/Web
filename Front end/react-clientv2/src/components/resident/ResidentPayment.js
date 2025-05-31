import { useState, useContext, useEffect } from "react";
import { Alert, Table, Button, Form, Card } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/Contexts";
import { FaCreditCard, FaUpload } from "react-icons/fa";
import UploadProofForm from "./UploadProofForm";

const ResidentPayment = () => {
    const [method, setMethod] = useState("vnpay");
    const user = useContext(MyUserContext);
    const [payments, setPayments] = useState([]);
    const [msg, setMsg] = useState();

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await authApis().get(endpoints["user-payment"]);
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
        <div className="container py-4">
            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <h2 className="h3 mb-4">Chọn phương thức thanh toán</h2>
                    <Form className="mb-4">
                        <div className="d-flex gap-4">
                            <Form.Check
                                type="radio"
                                label={
                                    <span className="d-flex align-items-center">
                                        <FaCreditCard className="me-2" /> Thanh toán qua VNPay
                                    </span>
                                }
                                name="paymentMethod"
                                id="vnpay"
                                value="vnpay"
                                checked={method === "vnpay"}
                                onChange={() => setMethod("vnpay")}
                                className="fw-medium"
                            />
                            <Form.Check
                                type="radio"
                                label={
                                    <span className="d-flex align-items-center">
                                        <FaUpload className="me-2" /> Gửi ảnh minh chứng
                                    </span>
                                }
                                name="paymentMethod"
                                id="upload"
                                value="upload"
                                checked={method === "upload"}
                                onChange={() => setMethod("upload")}
                                className="fw-medium"
                            />
                        </div>
                    </Form>

                    {msg && <Alert variant="danger">{msg}</Alert>}

                    {method === "vnpay" ? (
                        <>
                            <h4 className="h5 mb-4">Danh sách phiếu thanh toán của bạn</h4>
                            {payments.length === 0 ? (
                                <Alert variant="info">Không có phiếu thanh toán nào.</Alert>
                            ) : (
                                payments.map((payment, index) => {
                                    const total = payment.items?.reduce(
                                        (sum, item) => sum + (item.amount || 0),
                                        0
                                    );
                                    return (
                                        <Card key={payment.id} className="mb-4 border-0 shadow-sm">
                                            <Card.Body>
                                                <h5 className="h6 mb-3">
                                                    Phiếu thanh toán #{index + 1} - Mã:{" "}
                                                    <span className="text-primary">{payment.transactionCode}</span>
                                                </h5>
                                                <Table striped bordered hover className="mb-3">
                                                    <thead className="table-light">
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
                                                        <tr className="table-light">
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
                                                    variant={payment.status === "APPROVED" ? "secondary" : "primary"}
                                                    onClick={() => handlePayment(payment.transactionCode)}
                                                    disabled={payment.status === "APPROVED"}
                                                    className="w-100"
                                                >
                                                    {payment.status === "APPROVED"
                                                        ? "Đã thanh toán"
                                                        : "Thanh toán qua VNPay"}
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    );
                                })
                            )}
                        </>
                    ) : (
                        <>
                            <h4 className="h5 mb-4">Gửi ảnh minh chứng chuyển khoản</h4>
                            {payments.length === 0 ? (
                                <Alert variant="info">Không có phiếu thanh toán nào.</Alert>
                            ) : (
                                payments.map((payment, index) => (
                                    <Card key={payment.id} className="mb-4 border-0 shadow-sm">
                                        <Card.Body>
                                            <h5 className="h6 mb-3">
                                                Phiếu thanh toán #{index + 1} - Mã:{" "}
                                                <span className="text-primary">{payment.transactionCode}</span>
                                            </h5>
                                            <Table striped bordered hover className="mb-3">
                                                <thead className="table-light">
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
                                                    <tr className="table-light">
                                                        <td colSpan={2}>
                                                            <b>Tổng cộng</b>
                                                        </td>
                                                        <td>
                                                            <b>
                                                                {payment.items?.reduce(
                                                                    (sum, item) => sum + (item.amount || 0),
                                                                    0
                                                                ).toLocaleString()}
                                                            </b>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                            <UploadProofForm paymentId={payment.id} />
                                        </Card.Body>
                                    </Card>
                                ))
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default ResidentPayment;