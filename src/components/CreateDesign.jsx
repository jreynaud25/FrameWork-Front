import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
const CreateDesign = () => {
  const [name, setName] = useState("");
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
    try {
      const response = await axios.post(
        "http://localhost:3000/api/rubberduck",
        fd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

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
