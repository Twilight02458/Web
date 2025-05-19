import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../../configs/Contexts";

const RequireAdmin = ({ children }) => {
  const user = useContext(MyUserContext);
  const nav = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      nav("/");
    }
  }, [user, nav]);

  return children;
};

export default RequireAdmin;