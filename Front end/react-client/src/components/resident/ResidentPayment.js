import { useState, useContext, useEffect } from "react";
import { Alert, Table, Button, Form } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/Contexts";
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
        <div className="container mt-4">
            <h2>Chọn phương thức thanh toán</h2>
            <Form>
                <Form.Check
                    type="radio"
                    label="Thanh toán qua VNPay"
                    name="paymentMethod"
                    id="vnpay"
                    value="vnpay"
                    checked={method === "vnpay"}
                    onChange={() => setMethod("vnpay")}
                    inline
                />
                <Form.Check
                    type="radio"
                    label="Gửi ảnh minh chứng chuyển khoản"
                    name="paymentMethod"
                    id="upload"
                    value="upload"
                    checked={method === "upload"}
                    onChange={() => setMethod("upload")}
                    inline
                />
            </Form>
            <hr />

            {method === "vnpay" ? (
                <>
                    <h4>Danh sách phiếu thanh toán của bạn</h4>
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
                </>
            ) : (
                <>
                    <h4>Gửi ảnh minh chứng chuyển khoản</h4>
                    {payments.length === 0 ? (
                        <Alert variant="info">Không có phiếu thanh toán nào.</Alert>
                    ) : (
                        payments.map((payment, index) => (
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
                            </div>
                        ))
                    )}
                </>
            )}
        </div>
    );
};

export default ResidentPayment;