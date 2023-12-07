import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Designs = () => {
  const { user, isLoggedIn, authenticateUser } = useContext(AuthContext);
  const [designs, setDesigns] = useState([]);

  const getDesigns = async () => {
    try {
      const allDesigns = await axios.get(`${BACKEND_URL}/api/designs/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDesigns(allDesigns.data);
      console.log(allDesigns.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getOwnedDesigns = async () => {
    try {
      const allDesigns = await axios.get(`${BACKEND_URL}/api/designs/owned`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDesigns(allDesigns.data);
      console.log(allDesigns.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user.status === "admin") {
      getDesigns();
    } else {
      getOwnedDesigns();
    }
  }, []);
  return (
    <div>
      {isLoggedIn && user.status === "admin" && (
        <>
          <NavLink to={"/Designs/create"}>Create Desgins</NavLink>
        </>
      )}

      {designs.map((design) => {
        return (
          <div key={design._id}>
            <Link to={design._id}>{design.name}</Link>
          </div>
        );
      })}
    </div>
  );
};

export default Designs;
