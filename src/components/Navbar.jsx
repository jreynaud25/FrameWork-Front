import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Logo from "../assets/framework-log.svg";
const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL || "https://frame-work.app";
const Navbar = () => {
  const { user, isLoggedIn, authenticateUser } = useContext(AuthContext);
  console.log(user);
  const logout = () => {
    localStorage.removeItem("token");
    authenticateUser();
  };
  return (
    <>
      <nav className="logoWrapper">
        <img
          onClick={() => (window.location.href = FRONTEND_URL)}
          src={Logo}
          alt="Logo"
        />
      </nav>
      <div className="Navbar">
        {!isLoggedIn && (
          <>
            <nav>
              <NavLink to={"/auth/login"}>Log in</NavLink>
            </nav>
          </>
        )}
        <nav>
          <NavLink to={"/profile"}>{user?.username}</NavLink>
        </nav>

        {isLoggedIn && user.status === "admin" && (
          <>
            <nav>
              <NavLink to={"/Clients"}>Clients</NavLink>
            </nav>
          </>
        )}
        {isLoggedIn && (
          <>
            <nav>
              <NavLink to={"/Designs"}>Designs</NavLink>
            </nav>
            {user.pictureUrl && (
              <img src={user.pictureUrl} style={{ width: "50px" }}></img>
            )}

            <nav>
              <button onClick={logout}>Logout</button>
            </nav>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
