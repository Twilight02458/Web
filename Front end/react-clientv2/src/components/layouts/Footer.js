import { Container, Row, Col } from "react-bootstrap";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <Container>
        <Row className="g-4">
          <Col md={4} className="mb-3">
            <h5 className="fw-bold mb-4">Liên hệ</h5>
            <div className="d-flex align-items-center mb-3">
              <FaPhone className="me-3 text-primary" />
              <p className="mb-0">0123 456 789</p>
            </div>
            <div className="d-flex align-items-center mb-3">
              <FaEnvelope className="me-3 text-primary" />
              <p className="mb-0">info@ecommerce.com</p>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <h5 className="fw-bold mb-4">Địa chỉ</h5>
            <div className="d-flex align-items-start">
              <FaMapMarkerAlt className="me-3 text-primary mt-1" />
              <p className="mb-0">123 Đường ABC, Quận 1, Hồ Chí Minh, Việt Nam</p>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <h5 className="fw-bold mb-4">Theo dõi chúng tôi</h5>
            <div className="d-flex gap-3">
              <a href="#" className="text-light fs-4 hover-shadow">
                <FaFacebook />
              </a>
              <a href="#" className="text-light fs-4 hover-shadow">
                <FaTwitter />
              </a>
              <a href="#" className="text-light fs-4 hover-shadow">
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>
        <hr className="my-4 border-secondary" />
        <div className="text-center text-secondary">
          <small>&copy; {new Date().getFullYear()} Chung Cư Thông Minh. All rights reserved.</small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
