import { Route, Routes } from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./components/pages/Home";
import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import { MyDispatchContext, MyUserContext } from "./configs/Contexts";
import MyUserReducer from "./reducers/MyUserReducer";
import FirstLogin from "./components/pages/FirstLogin";
import AdminRegister from "./components/admin/AdminRegister";
import { useNavigate, useLocation } from "react-router-dom";
import RequireAdmin from "./components/auth/RequireAdmin";
import AdminUserList from "./components/admin/AdminUserList";
import AdminHome from "./components/admin/AdminHome";
import { useEffect, useReducer, useState, useContext, createContext } from "react";
import cookie from "react-cookies";
import { authApis, endpoints } from "./configs/Apis";
import AdminLockerItems from "./components/admin/AdminLockerItems";
import ResidentLocker from "./components/resident/ResidentLocker";
import ResidentPayment from "./components/resident/ResidentPayment";
import ResidentPaymentResult from "./components/resident/ResidentPaymentResult";
import AdminCreatePayment from "./components/admin/AdminCreatePayment";
import ResidentPaymentDetail from "./components/resident/ResidentPaymentDetail";
import ResidentSurvey from "./components/resident/ResidentSurvey";
import FeedbackForm from "./components/resident/FeedbackForm";


const RequireAuth = ({ children }) => {
  const user = useContext(MyUserContext);
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Chỉ cho phép vào /login và /first-login nếu chưa đăng nhập
    if (!user && location.pathname !== "/login" && location.pathname !== "/first-login") {
      nav("/login");
    }
  }, [user, nav, location]);

  return children;
};

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = cookie.load("token");
      if (token) {
        try {
          let res = await authApis().get(endpoints['current-user']);
          dispatch({ type: "login", payload: res.data });
        } catch {
          cookie.remove("token");
        }
      }
      setAppLoading(false); // Đã kiểm tra xong
    };
    loadUser();
  }, []);

  if (appLoading) return null; // hoặc <MySpinner /> nếu muốn

  return (
    <div className="d-flex flex-column min-vh-100">
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <Header />
          <Container className="flex-grow-1">
            <RequireAuth>
              <Routes>
                <Route path="/admin/users/create-payment" element={
                  <RequireAdmin>
                    <AdminCreatePayment />
                  </RequireAdmin>
                } />
                <Route path="/admin/users/edit-user" element={
                  <RequireAdmin>
                    <AdminUserList />
                  </RequireAdmin>
                } />
                <Route path="/admin/locker/:userId" element={
                  <RequireAdmin>
                    <AdminLockerItems />
                  </RequireAdmin>
                } />
                <Route path="/admin/register" element={
                  <RequireAdmin>
                    <AdminRegister />
                  </RequireAdmin>
                } />
                <Route path="/admin/users" element={
                  <RequireAdmin>
                    <AdminUserList />
                  </RequireAdmin>
                } />
                <Route path="/admin" element={
                  <RequireAdmin>
                    <AdminHome />
                  </RequireAdmin>
                } />
                <Route path="/survey" element={<ResidentSurvey />} />
                <Route path="/feedback" element={<FeedbackForm />} />
                <Route path="/paymentdetail" element={<ResidentPaymentDetail />} />
                <Route path="/payment" element={<ResidentPayment />} />
                <Route path="/payment/result" element={<ResidentPaymentResult />} />
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/first-login" element={<FirstLogin />} />
                <Route path="/locker" element={<ResidentLocker />} />
              </Routes>
            </RequireAuth>
          </Container>
          <Footer />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </div>
  );
}
export default App;