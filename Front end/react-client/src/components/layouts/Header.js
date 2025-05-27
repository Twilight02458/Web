import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { FaHome, FaSignInAlt, FaComments, FaIdCard, FaExclamationCircle, FaList, FaUsers } from "react-icons/fa";
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
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-warning">
          MyApartment
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <FaHome className="me-1" /> Trang chủ
            </Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/locker">
                  <FaIdCard className="me-1" /> Tủ đồ
                </Nav.Link>
                <Nav.Link as={Link} to="/chat">
                  <FaComments className="me-1" /> Chat
                </Nav.Link>
                <Nav.Link as={Link} to="/family-members">
                  <FaIdCard className="me-1" /> Thẻ khách
                </Nav.Link>
                {user.role === "RESIDENT" && (
                  <>
                    <Nav.Link as={Link} to="/submit-complaint">
                      <FaExclamationCircle className="me-1" /> Gửi phản ánh
                    </Nav.Link>
                    <Nav.Link as={Link} to="/my-complaints">
                      <FaList className="me-1" /> Phản ánh của tôi
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
                    <span>
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          roundedCircle
                          width="30"
                          height="30"
                          className="me-2"
                        />
                      ) : (
                        <FaSignInAlt className="me-2" />
                      )}
                      {user.username}
                    </span>
                  }
                  id="basic-nav-dropdown"
                  className="text-light"
                >
                  <NavDropdown.Item onClick={logout}>Đăng xuất</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              !isLoginPage && (
                <Nav.Link as={Link} to="/login">
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