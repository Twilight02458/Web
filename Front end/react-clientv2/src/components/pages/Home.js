import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaHome, FaComments, FaPoll, FaIdCard, FaUsers, FaCommentAlt, FaDonate } from "react-icons/fa";

function Home() {
  const features = [
    {
      icon: <FaHome size={40} className="text-primary mb-3" />,
      title: "Quản lý căn hộ",
      description: "Theo dõi và quản lý thông tin căn hộ của bạn một cách dễ dàng"
    },
    {
      icon: <FaComments size={40} className="text-success mb-3" />,
      title: "Hệ thống chat",
      description: "Liên lạc với ban quản lý và cư dân khác một cách nhanh chóng"
    },
    {
      icon: <FaPoll size={40} className="text-warning mb-3" />,
      title: "Khảo sát",
      description: "Tham gia các cuộc khảo sát ý kiến cư dân"
    },
    {
      icon: <FaIdCard size={40} className="text-info mb-3" />,
      title: "Tủ đồ cá nhân",
      description: "Quản lý và theo dõi đồ đạc trong tủ đồ của bạn"
    },
    {
      icon: <FaUsers size={40} className="text-secondary mb-3" />,
      title: "Quản lý khách",
      description: "Đăng ký và quản lý thông tin khách đến thăm"
    },
    {
      icon: <FaCommentAlt size={40} className="text-secondary mb-3" />,
      title: "Gửi phản ánh",
      description: "Gửi phản ánh và yêu cầu đến ban quản lý"
    },
    {
      icon: <FaDonate size={40} className="text-secondary mb-3" />,
      title: "Thanh toán",
      description: "Thanh toán các khoản phí dịch vụ"
    }
  ];

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">Chào mừng đến với Chung Cư Thông Minh</h1>
        <p className="lead text-muted">Hệ thống quản lý chung cư hiện đại, tiện ích và an toàn</p>
      </div>

      <Row className="g-4">
        {features.map((feature, index) => (
          <Col key={index} md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0 hover-shadow">
              <Card.Body className="text-center p-4">
                {feature.icon}
                <h3 className="h4 mb-3">{feature.title}</h3>
                <p className="text-muted mb-0">{feature.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-5">
        <h2 className="h3 mb-4">Tại sao chọn chúng tôi?</h2>
        <Row className="justify-content-center">
          <Col md={8}>
            <p className="lead text-muted">
              Chung Cư Thông Minh cung cấp giải pháp quản lý toàn diện, giúp cư dân và ban quản lý
              tương tác hiệu quả, nâng cao chất lượng cuộc sống và tạo môi trường sống an toàn,
              tiện nghi cho mọi người.
            </p>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default Home;