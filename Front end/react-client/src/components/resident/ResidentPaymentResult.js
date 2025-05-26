import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Alert, Spinner, Card } from "react-bootstrap";

const ResidentPaymentResult = () => {
    const location = useLocation();
    const [result, setResult] = useState(null);

   useEffect(() => {
    // Lấy params từ URL
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    const message = params.get("message");
    const amount = params.get("amount");
    const feeType = params.get("feeType");
    const transactionCode = params.get("transactionCode");
    const paymentDate = params.get("paymentDate");

    if (status === "success") {
        setResult({
            status: "success",
            message: "Thanh toán thành công!",
            amount,
            feeType: feeType ? decodeURIComponent(feeType) : "",
            transactionCode,
            paymentDate
        });
    } else {
        setResult({
            status: status || "error",
            message: message ? decodeURIComponent(message) : "Không xác nhận được kết quả giao dịch!"
        });
    }
}, [location]);

    if (!result) {
        return (
            <div className="container mt-4 text-center">
                <Spinner animation="border" variant="primary" />
                <p>Đang xác minh giao dịch từ VNPAY...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Kết quả thanh toán</h3>
            <Alert variant={result.status === "success" ? "success" : "danger"}>
                <strong>{result.message}</strong>
            </Alert>

            {result.status === "success" && (
                <Card>
                    <Card.Body>
                         <p><strong>Ngày thanh toán:</strong> {result.paymentDate ? new Date(Number(result.paymentDate)).toLocaleString("vi-VN") : ""}</p>
                        <p><strong>Phương thức:</strong> VNPAY</p>
                        <p><strong>Mã giao dịch:</strong> {result.transactionCode}</p>
                        <p><strong>Loại phí:</strong> {result.feeType}</p>
                        <p><strong>Số tiền thanh toán:</strong> {Number(result.amount).toLocaleString("vi-VN")} VNĐ</p>                        
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default ResidentPaymentResult;