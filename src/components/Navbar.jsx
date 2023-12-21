import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const { user, isLoggedIn, authenticateUser } = useContext(AuthContext);
  //console.log(user);
  const logout = () => {
    localStorage.removeItem("token");
    authenticateUser();
  };
  return (
    <nav className="Navbar">
      <NavLink to={"/"}>
        <h1>Framework.</h1>
      </NavLink>
      <ul>
        {/* <li>
          <NavLink to={"/"}>Home</NavLink>
        </li> */}
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
