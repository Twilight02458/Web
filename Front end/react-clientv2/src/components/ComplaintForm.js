import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { MyUserContext } from "../configs/Contexts";
import { authApis, endpoints } from "../configs/Apis";
import cookies from "react-cookies";

const ComplaintForm = () => {
  const user = useContext(MyUserContext); // Lấy thông tin user hiện tại từ Context

  const [complaint, setComplaint] = useState({
    title: "",
    description: "",
    location: "",
    priority: "MEDIUM",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState();

  useEffect(() => {
    // Nếu chưa đăng nhập thì chuyển về trang login
    const token = cookies.load("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để gửi phản ánh!");
      window.location.href = "/login";
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Nếu trường priority thì lưu giá trị uppercase (giống DTO)
    setComplaint((prev) => ({
      ...prev,
      [name]: name === "priority" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: complaint.title,
        description: complaint.description,
        location: complaint.location,
        priority: complaint.priority,
        userId: user.id  // Đảm bảo user.id tồn tại
      };

      console.log("Sending complaint data:", payload);

      const response = await authApis().post(endpoints['user-complaints'], payload);
      console.log("Response:", response.data);

      if (response.status === 201) {
        toast.success("Phản ánh đã được gửi thành công!");
        // Reset form
      }
    } catch (error) {
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 container">
      <h2 className="mb-4">Gửi phản ánh</h2>

      {msg && <Alert variant="danger">{msg}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tiêu đề</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={complaint.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề phản ánh"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mô tả chi tiết</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={complaint.description}
            onChange={handleChange}
            placeholder="Mô tả chi tiết vấn đề bạn muốn phản ánh"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Vị trí</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={complaint.location}
            onChange={handleChange}
            placeholder="Ví dụ: Tầng 5, Khu A, Chung cư..."
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mức độ ưu tiên</Form.Label>
          <Form.Select
            name="priority"
            value={complaint.priority}
            onChange={handleChange}
          >
            <option value="LOW">Thấp</option>
            <option value="MEDIUM">Trung bình</option>
            <option value="HIGH">Cao</option>
            <option value="URGENT">Khẩn cấp</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading} className="w-100">
          {loading ? "Đang gửi..." : "Gửi phản ánh"}
        </Button>
      </Form>
    </div>
  );
};

export default ComplaintForm;
