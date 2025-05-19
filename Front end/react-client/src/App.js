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
import { useEffect, useReducer, useState, useContext } from "react";
import cookie from "react-cookies";
import { authApis, endpoints } from "./configs/Apis";
import AdminLockerItems from "./components/admin/AdminLockerItems";
import ResidentLocker from "./components/resident/ResidentLocker";
import { Chat } from "./components/Chat";
import RoomSelection from "./components/RoomSelection";

const RequireAuth = ({ children }) => {
  const user = useContext(MyUserContext);
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
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
      setAppLoading(false);
    };
    loadUser();
  }, []);

  if (appLoading) return null;

  return (
    <div className="d-flex flex-column min-vh-100">
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <Header />
          <Container className="flex-grow-1">
            <RequireAuth>
              <Routes>
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
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/first-login" element={<FirstLogin />} />
                <Route path="/locker" element={<ResidentLocker />} />
                <Route path="/chat" element={<RoomSelection />} />
                <Route path="/chat/:roomId" element={<Chat />} />
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