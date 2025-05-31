import { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import { FaUpload, FaCheck } from "react-icons/fa";

function UploadProofForm({ paymentId }) {
    const [file, setFile] = useState(null);
    const [responseDto, setResponseDto] = useState(null);
    const [msg, setMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMsg("Vui lòng chọn file ảnh!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("paymentId", paymentId);

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
            setResponseDto(res.data);
            setMsg("Gửi minh chứng thành công!");
            setFile(null);
        } catch (error) {
            setMsg("Gửi minh chứng thất bại!");
        }
    };

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Chọn ảnh minh chứng</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="mb-2"
                        />
                        <Form.Text className="text-muted">
                            Chỉ chấp nhận file ảnh (jpg, png, jpeg)
                        </Form.Text>
                    </Form.Group>

                    {msg && (
                        <Alert variant={responseDto ? "success" : "danger"} className="mb-3">
                            {msg}
                        </Alert>
                    )}

                    {responseDto && (
                        <div className="mb-3 p-3 bg-light rounded">
                            <h6 className="mb-2">Thông tin xác nhận:</h6>
                            <p className="mb-1">
                                <strong>Trạng thái phiếu:</strong>{" "}
                                <span className={responseDto.paymentStatus === "APPROVED" ? "text-success" : "text-warning"}>
                                    {responseDto.paymentStatus === "APPROVED" ? "Đã duyệt" : "Đang chờ duyệt"}
                                </span>
                            </p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-100"
                        disabled={!file || responseDto?.paymentStatus === "APPROVED"}
                    >
                        {responseDto?.paymentStatus === "APPROVED" ? (
                            <span className="d-flex align-items-center justify-content-center">
                                <FaCheck className="me-2" /> Đã xác nhận
                            </span>
                        ) : (
                            <span className="d-flex align-items-center justify-content-center">
                                <FaUpload className="me-2" /> Gửi minh chứng
                            </span>
                        )}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default UploadProofForm;