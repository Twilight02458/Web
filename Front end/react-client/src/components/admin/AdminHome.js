import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
    const nav = useNavigate();

    return (
        <Container className="mt-5 text-center">
            <h2>Chào mừng Quản trị viên!</h2>
            <p>Chọn chức năng quản lý:</p>            
        </Container>
    );
};

export default AdminHome;