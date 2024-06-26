import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import "./AuthForm.css";
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
  const [picture, setPicture] = useState();
  const [clients, setClients] = useState([]);

  const navigate = useNavigate();
  const currentURL = window.location.host;
  const subdomain = currentURL.split(".")[0];
  const domain = FRONTEND_URL.split("//")[1];

  const [searchParams, setSearchParams] = useSearchParams();

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/client/all`);
      //.log("fetching clients", response);
      setClients(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  function isStringContained(clients, subdomain) {
    for (const client of clients) {
      if (client.username === subdomain) {
        return true;
      }
    }
    return false;
  }

  if (mode === "Loggedin") {
    const token = searchParams.get("token");
    //console.log("should save the token received as param", token);
    localStorage.setItem("token", token);

    // setResponse("ok");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userToLogin = { username, password, email };

      if (mode === "Create") {
        // Validate username and email fields
        if (!username || !email) {
          setError("Username or E-mail cannot be empty");
          return;
        }

        console.log(
          "bonjour je dois creer cet user",
          userToLogin.username,
          userToLogin.email
        );
        const fd = new FormData();
        fd.append("username", JSON.stringify(userToLogin.username));
        fd.append("email", JSON.stringify(userToLogin.email));
        if (picture) {
          fd.append("picture", picture.file, picture.file.name);
        }

        console.log("le fd total", fd);

        const response = await axios.post(
          `${BACKEND_URL}/api/auth/signup`,
          fd,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("response", response);
        setResponse(response.statusText);
        // Wait 500ms before navigating
        setTimeout(() => {
          navigate("/Clients");
        }, 500);
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
        //just for dev purpose
        if (
          currentURL.includes("localhost") ||
          currentURL.includes("damdam.io")
        ) {
          console.log("salut include localhost", domain);
          window.location.href = `http://${username}.${domain}/auth/loggedin?token=${response.data.token}`;
        } else {
          console.log("pas de local host", domain);
          window.location.href = `https://${username}.${domain}/auth/loggedin?token=${response.data.token}`;
        }
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  function handleFile(event, name) {
    // console.log(event.target.files);
    //console.log("hndling file", event.target.files);
    //console.log("name", event.target.files[0].name);
    const newPicture = {
      name: event.target.files[0].name,
      file: event.target.files[0],
    };
    // Add the new picture to the existing picture array
    setPicture(newPicture);
  }

  useEffect(() => {
    fetchClients();
    if (isLoggedIn && mode === "Update") {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, []);
  useEffect(() => {
    if (
      domain != currentURL &&
      clients.length > 0 &&
      !isStringContained(clients, subdomain)
    ) {
      console.log("moving to default page");
      window.location.href = `${FRONTEND_URL}`;
    }
  }, [clients]);
  useEffect(() => {
    if (mode === "Loggedin") {
      navigate("/Designs");
    }
  }, [localStorage]);

  return (
    <div className="login-wrapper">
      <form className="login-container" onSubmit={handleSubmit}>
        {mode !== "Update" && (
          <label className="title" htmlFor="username"></label>
        )}
        {mode == "Update" && <label>Edit Profile</label>}

        {mode !== "Update" && (
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        {isLoggedIn && (
          <>
            {/* <label htmlFor="email">E-mail : </label> */}
            <input
              type="email"
              value={email}
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
            />
            Profile picture
            <input id="fileInput" type="file" onChange={handleFile} />
          </>
        )}

        {mode !== "Create" && mode !== "Reset" && (
          <div>
            <label className="title" htmlFor="password"></label>
            <input
              type="password"
              placeholder="Password"
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
        <button>{mode}</button>
      </form>
    </div>
  );
};

export default AuthForm;
