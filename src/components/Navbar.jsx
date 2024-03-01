import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
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
    <nav className="Navbar">
      <button onClick={() => (window.location.href = FRONTEND_URL)}>
        {" "}
        Framework.
      </button>
      <ul>
        {!isLoggedIn && (
          <>
            <li>
              <NavLink to={"/auth/login"}>Log in</NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink to={"/profile"}>{user?.username}</NavLink>
        </li>

        {isLoggedIn && user.status === "admin" && (
          <>
            <li>
              <NavLink to={"/Clients"}>Clients</NavLink>
            </li>
          </>
        )}
        {isLoggedIn && (
          <>
            <li>
              <NavLink to={"/Designs"}>Designs</NavLink>
            </li>
            {user.pictureUrl && (
              <img src={user.pictureUrl} style={{ width: "50px" }}></img>
            )}

            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
