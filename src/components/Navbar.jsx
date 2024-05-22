import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/framework-log.svg";
import { AuthContext } from "../context/authContext";
import "./Navbar.css";
const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL || "https://frame-work.app";
const Navbar = () => {
  const { user, isLoggedIn, authenticateUser } = useContext(AuthContext);
  const navigate = useNavigate(); // useNavigate hook

  //console.log(user);
  const logout = () => {
    localStorage.removeItem("token");
    authenticateUser();
    navigate("/auth/login");
  };
  return (
    <>
      <div className="Navbar">
        {isLoggedIn && (
          <>
            <nav>
              <NavLink to={"/Designs"}>Designs</NavLink>
            </nav>
          </>
        )}
      </div>
      <nav className="logoWrapper">
        <NavLink to={"/Designs"}>
          {" "}
          <img
            // onClick={() => (window.location.href = `${FRONTEND_URL}/Designs`)}
            src={Logo}
            alt="Logo"
          />
        </NavLink>
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
          <NavLink to={"/"}>Brand</NavLink>
        </nav>
        <nav>
          <NavLink to={"/profile"}>Settings</NavLink>
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
            {user.pictureUrl && (
              <img src={user.pictureUrl} style={{ width: "50px" }}></img>
            )}

            <nav onClick={logout}>
              <a href="#">Logout</a>
            </nav>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
