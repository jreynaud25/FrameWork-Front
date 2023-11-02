import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/";

const Designs = () => {
  const [designs, setDesigns] = useState([]);
  const getDesigns = async () => {
    try {
      const allDesigns = await axios.get(`${BACKEND_URL}/api/rubberduck`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDesigns(allDesigns.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDesigns();
  }, []);
  return (
    <div>
      <NavLink to={"/Designs/create"}>Create Desgins</NavLink>
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
