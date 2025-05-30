import { useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Alert, Button, Form } from "react-bootstrap";

function UploadProofForm({ paymentId }) {
    const [transactionCode, setTransactionCode] = useState("");
    const [file, setFile] = useState(null);
    const [responseDto, setResponseDto] = useState(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !transactionCode) {
            setError("Vui lòng nhập mã giao dịch và chọn hình ảnh.");
            return;
        }

        const formData = new FormData();
        formData.append("paymentId", paymentId);
        formData.append("transactionCode", transactionCode);
        formData.append("file", file);

        try {
            const res = await authApis().post(
                endpoints["user-payment-proof"],
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setResponseDto(res.data); // res.data là PaymentProveDto
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi không xác định");
            setResponseDto(null);
        }
    };

    return (
        <div className="mt-4">
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Mã giao dịch:</Form.Label>
                    <Form.Control
                        type="text"
                        value={transactionCode}
                        onChange={(e) => setTransactionCode(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mt-2">
                    <Form.Label>Ảnh uỷ nhiệm chi:</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-3">
                    Gửi minh chứng
                </Button>
            </Form>

            {/* Error message */}
            {error && <Alert className="mt-2" variant="danger">{error}</Alert>}

            {/* Success DTO display */}
            {responseDto && (
                <Alert className="mt-3" variant="success">
                    <h5>✅ Gửi minh chứng thành công!</h5>
                    <p><strong>Mã giao dịch:</strong> {responseDto.transactionCode}</p>
                    <p><strong>Thời gian gửi:</strong> {new Date(responseDto.submittedAt).toLocaleString()}</p>
                    <p><strong>Trạng thái phiếu:</strong> {responseDto.paymentStatus}</p>
                    <div>
                        <strong>Ảnh minh chứng:</strong><br />
                        <img src={responseDto.proofImageUrl} alt="Proof" style={{ maxWidth: "100%", maxHeight: 300 }} />
                    </div>
                </Alert>
            )}
        </div>
    );
}

export default UploadProofForm;
