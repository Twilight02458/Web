import { Route, Routes } from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./components/pages/Home";
import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/custom.css';
import { ToastContainer } from 'react-toastify';
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import { MyDispatchContext, MyUserContext } from "./configs/Contexts";
import MyUserReducer from "./reducers/MyUserReducer";
import FirstLogin from "./components/pages/FirstLogin";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useReducer, useState, useContext } from "react";
import cookie from "react-cookies";
import { authApis, endpoints } from "./configs/Apis";
import ResidentLocker from "./components/resident/ResidentLocker";
import { Chat } from "./components/Chat";
import RoomSelection from "./components/RoomSelection";
import FamilyMemberList from "./components/FamilyMemberList";
import ResidentSurvey from "./components/resident/ResidentSurvey";
import FeedbackForm from "./components/resident/FeedbackForm";
import ResidentPayment from "./components/resident/ResidentPayment";
import ResidentPaymentDetail from "./components/resident/ResidentPaymentDetail";

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
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/first-login" element={<FirstLogin />} />
                <Route path="/locker" element={<ResidentLocker />} />
                <Route path="/chat" element={<RoomSelection />} />
                <Route path="/chat/:roomId" element={<Chat />} />
                <Route path="/family-members" element={
                  <RequireAuth>
                    <FamilyMemberList />
                  </RequireAuth>
                } />
                <Route path="/survey" element={<ResidentSurvey />} />
                <Route path="/feedback" element={<FeedbackForm />} />
                <Route path="/payment" element={<ResidentPayment />} />
                <Route path="/payment-detail" element={<ResidentPaymentDetail />} />
              </Routes>
            </RequireAuth>
          </Container>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </div>
  );
}

export default App;