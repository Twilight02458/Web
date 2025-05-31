import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { FaHome, FaSignInAlt, FaComments, FaIdCard, FaExclamationCircle, FaList, FaUsers, FaPoll, FaUserCircle } from "react-icons/fa";
import { MyUserContext, MyDispatchContext } from "../../configs/Contexts";
import cookie from "react-cookies";

const Header = () => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigate();
  const location = useLocation();

  const logout = () => {
    cookie.remove("token");
    dispatch({ type: "logout" });
    nav("/login");
  };

  const isLoginPage = location.pathname === "/login";

  return (
    <Navbar bg="primary" expand="lg" className="shadow-sm py-3 bg-gradient-primary">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-white">
          <FaHome className="me-2" />Chung Cư Thông Minh
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 text-white" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="text-white fw-medium px-3">
              <FaHome className="me-1" /> Trang chủ
            </Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/locker" className="text-white fw-medium px-3">
                  <FaIdCard className="me-1" /> Tủ đồ cá nhân
                </Nav.Link>
                <Nav.Link as={Link} to="/chat" className="text-white fw-medium px-3">
                  <FaComments className="me-1" /> Hệ thống chat
                </Nav.Link>
                <Nav.Link as={Link} to="/family-members" className="text-white fw-medium px-3">
                  <FaUsers className="me-1" /> Thẻ thành viên
                </Nav.Link>
                {user.role === "RESIDENT" && (
                  <>
                    <Nav.Link as={Link} to="/submit-complaint" className="text-white fw-medium px-3">
                      <FaExclamationCircle className="me-1" /> Gửi phản ánh
                    </Nav.Link>
                    <Nav.Link as={Link} to="/my-complaints" className="text-white fw-medium px-3">
                      <FaList className="me-1" /> Phản ánh của tôi
                    </Nav.Link>
                    <Nav.Link as={Link} to="/survey" className="text-white fw-medium px-3">
                      <FaPoll className="me-1" /> Khảo sát ý kiến
                    </Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <NavDropdown
                  title={
                    <span className="d-flex align-items-center text-white">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          roundedCircle
                          width="32"
                          height="32"
                          className="me-2 border border-2 border-white"
                        />
                      ) : (
                        <FaUserCircle className="me-2" size={24} />
                      )}
                      <span className="fw-medium">{user.username}</span>
                    </span>
                  }
                  id="basic-nav-dropdown"
                  className="text-white"
                >
                  <NavDropdown.Item onClick={logout} className="text-danger fw-medium">
                    <FaSignInAlt className="me-2" /> Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              !isLoginPage && (
                <Nav.Link as={Link} to="/login" className="btn btn-light px-4 fw-medium text-primary">
                  <FaSignInAlt className="me-1" /> Đăng nhập
                </Nav.Link>
              )
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;