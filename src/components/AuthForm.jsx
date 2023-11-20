import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const AuthForm = ({ mode }) => {
  const { authenticateUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  //console.log(username);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userToLogin = { username, password, email };
      if (mode === "Signup") {
        const response = await axios.post(
          `${BACKEND_URL}/api/auth/signup`,
          userToLogin
        );
        navigate("/auth/login");
      } else {
        const response = await axios.post(
          `${BACKEND_URL}/api/auth/login`,
          userToLogin
        );
        localStorage.setItem("token", response.data.token);
        setError("");
        await authenticateUser();
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {mode === "Signup" ? (
          <div>
            <label htmlFor="email">email: </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        ) : null}

        <p style={{ color: "red" }}>{error}</p>

        <button>{mode}</button>
      </form>
    </div>
  );
};

export default AuthForm;
