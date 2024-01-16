import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AuthForm.css";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useSearchParams, useNavigate, NavLink } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL || "https://frame-work.app";
const AuthForm = ({ mode }) => {
  const { user, authenticateUser, isLoggedIn } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const currentURL = window.location.host;
  const subdomain = currentURL.split(".")[0];
  const domain = FRONTEND_URL.split("//")[1];

  const [searchParams, setSearchParams] = useSearchParams();

  if (mode === "Loggedin") {
    const token = searchParams.get("token");
    console.log("should save the token received as param", token);
    localStorage.setItem("token", token);

    // setResponse("ok");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // if (subdomain != "www" || subdomain != "frame-work") {
    //   if (username.toLowerCase() !== subdomain.toLowerCase()) {
    //     console.log("the subdomain is ", subdomain);
    //     alert(
    //       `You're not part of this subdomain, redirecting to : ${FRONTEND_URL}`
    //     );
    //     window.location.href = FRONTEND_URL;
    //     return;
    //   }
    // }

    try {
      const userToLogin = { username, password, email };

      if (mode === "Create") {
        console.log("bonjour je dois creer cet user", userToLogin);
        const response = await axios.post(
          //`${BACKEND_URL}/api/client`,
          `${BACKEND_URL}/api/auth/signup`,
          userToLogin
        );
        navigate("/Clients");
      } else if (mode === "Update") {
        console.log("goind to patch", userToLogin);
        const response = await axios.patch(
          //`${BACKEND_URL}/api/client`,
          `${BACKEND_URL}/api/auth/update/${user._id}`,
          userToLogin,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.statusText);
        setResponse(response.statusText);
      } else if (mode === "Reset") {
        console.log("shloud reset ", username);
        const response = await axios.post(`${BACKEND_URL}/api/auth/reset`, {
          username,
        });
        setResponse(response.statusText);
      } else {
        const response = await axios.post(
          `${BACKEND_URL}/api/auth/login`,
          userToLogin
        );
        localStorage.setItem("token", response.data.token);
        setError("");
        await authenticateUser();
        // navigate(`/designs`);
        console.log("moving");
        window.location.href = `https://${username}.${domain}/auth/loggedin?token=${response.data.token}`;
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && mode === "Update") {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, []);
  useEffect(() => {
    if (mode === "Loggedin") {
      navigate("/Designs");
    }
  }, [localStorage]);

  return (
    <div>
      <form className="login-container" onSubmit={handleSubmit}>
        <div>
          {mode !== "Update" && (
            <label className="title" htmlFor="username">
              Username:{" "}
            </label>
          )}
          {mode == "Update" && <label>Edit Profile</label>}

          {mode !== "Update" && (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
        </div>
        {isLoggedIn && (
          <div>
            <label htmlFor="email">email: </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}

        {mode !== "Create" && mode !== "Reset" && (
          <div>
            <label className="title" htmlFor="password">
              Password:{" "}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}
        {mode === "Log in" && (
          <div>
            <NavLink to={"/auth/reset"}>Reset password</NavLink>
          </div>
        )}

        <p style={{ color: "red" }}>{error}</p>
        <p style={{ color: "green" }}>{response}</p>
        <button className="btn">{mode}</button>
      </form>
    </div>
  );
};

export default AuthForm;
