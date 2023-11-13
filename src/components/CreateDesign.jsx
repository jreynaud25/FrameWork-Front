import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const CreateDesign = () => {
  const [name, setName] = useState("");
  const [figmaID, setfigmaID] = useState("");
  const [picture, setPicture] = useState("");

  function handleFile(event) {
    console.log(event.target.files);
    setPicture(event.target.files[0]);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData();
    fd.append("name", name);
    fd.append("picture", picture);
    fd.append("figmaID", figmaID);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/designs`, fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    console.log("test du useEFFECT");
  }, [name]);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="figmaID">Figma ID: </label>
          <input
            type="text"
            value={figmaID}
            onChange={(event) => setfigmaID(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="picture">Picture:</label>
          <input type="file" onChange={handleFile} />
        </div>

        <button>Create a design</button>
      </form>

      <NavLink to={"/designs"}>Cancel</NavLink>
    </div>
  );
};

export default CreateDesign;
