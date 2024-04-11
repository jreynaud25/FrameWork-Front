import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const ProtectedRoute = () => {
  // const navigate = useNavigate()
  const { isLoggedIn, isLoading, user } = useContext(AuthContext);
  if (isLoading) {
    return <p>Loading...</p>;
  }
  //console.table(isLoading, isLoggedIn, user)
  if (!isLoggedIn) {
		console.log("You not logged in")
    return <Navigate to={"/auth/login"} />;
  }
  if (isLoggedIn) {
    return <Outlet />;
  }
};

export default ProtectedRoute;
