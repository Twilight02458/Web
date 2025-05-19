<<<<<<< HEAD
import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaHome, FaUserPlus, FaSignInAlt } from "react-icons/fa";

const Header = () => {
=======
import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { FaHome, FaSignInAlt, FaComments } from "react-icons/fa";
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

>>>>>>> a18e969 (Add Chat)
  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-warning">
<<<<<<< HEAD
          🛒 eCommerce
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="px-3 text-light">
              <FaHome className="me-1" />
              Trang chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/register" className="px-3 text-success">
              <FaUserPlus className="me-1" />
              Đăng ký
            </Nav.Link>
            <Nav.Link as={Link} to="/login" className="px-3 text-danger">
              <FaSignInAlt className="me-1" />
              Đăng nhập
            </Nav.Link>
=======
          MyApartment
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Nav bên trái */}
          <Nav className="me-auto">
            {user && user.role === "ADMIN" && (
              <>
                <Nav.Link
                  as={Link}
                  to="/admin/register"
                  className="px-3 fw-bold text-success" // text-success là màu xanh lá cây Bootstrap
                >
                  Đăng ký dân cư
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/admin/users"
                  className="px-3 fw-bold text-success"
                >
                  Danh sách dân cư
                </Nav.Link>
              </>
            )}
          </Nav>
          {/* Nav bên phải */}
          <Nav className="ms-auto">
            {user && !isLoginPage && (
              <Nav.Link as={Link} to="/chat" className="px-3 text-light">
                <FaComments className="me-1" />
                Chat
              </Nav.Link>
            )}
            {user && user.role === "RESIDENT" && !isLoginPage && (
              <Nav.Link as={Link} to="/locker" className="px-3 text-light">
                Tủ đồ
              </Nav.Link>
            )}
            {user && user.role === "RESIDENT" && !isLoginPage && (
              <Nav.Link as={Link} to="/" className="px-3 text-light">
                <FaHome className="me-1" />
                Trang chủ
              </Nav.Link>
            )}
             
            {user && (
              <NavDropdown
                title={
                  <Image
                    src={user.avatar || "https://example.com/default-avatar.png"}
                    roundedCircle
                    width={32}
                    height={32}
                    alt="avatar"
                  />
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Xem thông tin
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Đăng xuất</NavDropdown.Item>
              </NavDropdown>
            )}
>>>>>>> a18e969 (Add Chat)
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

<<<<<<< HEAD
export default Header;
=======
export default Header;
>>>>>>> a18e969 (Add Chat)
