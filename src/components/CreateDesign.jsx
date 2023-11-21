import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const CreateDesign = () => {
  const [name, setName] = useState("");
  const [figmaID, setfigmaID] = useState("");
  const [picture, setPicture] = useState("");
  const [figmaNodeId, setFigmaNodeId] = useState("");
  const [clients, setClients] = useState("");
  const [selectedClient, setSelectedClient] = useState("jean");
  const [defaultText, setDefaultText] = useState([]);
  const [numberOfTextEntries, setNumberOfTextEntries] = useState(0);

  function handleFile(event) {
    console.log(event.target.files);
    setPicture(event.target.files[0]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    console.log(event.target);
    const fd = new FormData();
    fd.append("name", name);
    fd.append("figmaID", figmaID);
    fd.append("figmaNodeId", figmaNodeId);
    fd.append("client", selectedClient);
    fd.append("numberOfTextEntries", numberOfTextEntries);

    const arrOfDefaultText = defaultText.slice(0, numberOfTextEntries);
    console.log(
      "salut array to send",
      arrOfDefaultText,
      typeof arrOfDefaultText
    );
    fd.append("defaultText", arrOfDefaultText);
    //fd.append("defaultText[]", arrOfDefaultText);

    console.log("voila le fd");
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

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/client`);
      setClients(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("fetching clients");
    fetchClients();
  }, []);

  if (!clients) {
    return <div>Loading...</div>;
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
          <label htmlFor="figmaID">Figma ID: </label>
          <input
            type="text"
            value={figmaID}
            onChange={(event) => setfigmaID(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="node">
            Figma node ids, like "1-54" without the quotes :{" "}
          </label>
          <input
            type="text"
            value={figmaNodeId}
            onChange={(event) => setFigmaNodeId(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="selectedClient">Client Name</label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            {clients.map((c, index) => {
              return (
                <option key={c.username} value={c.username}>
                  {c.username}
                </option>
              );
            })}
          </select>
        </div>

        {/* <div>
          <label htmlFor="picture">Picture:</label>
          <input type="file" onChange={handleFile} />
        </div> */}
        <div>
          <label htmlFor="numberOfTextEntries">numberOfTextEntries </label>
          <input
            id="number"
            type="number"
            value={numberOfTextEntries}
            onChange={(e) => {
              setNumberOfTextEntries(parseInt(e.target.value, 10));
            }}
          />
        </div>
        <div>
          {Array.from({ length: numberOfTextEntries })
            .fill(0)
            .map((e, i) => (
              <input
                key={i}
                placeholder={`DefaultValue${i}`}
                onChange={(val) => {
                  console.log("salut la val et l'index", i);
                  let temp = defaultText;
                  temp[i] = val.target.value;
                  setDefaultText(temp);
                  console.log(temp);
                }}
              ></input>
            ))}
        </div>
        <button>Create a design</button>
      </form>

      <NavLink to={"/designs"}>Cancel</NavLink>
    </div>
  );
};

export default CreateDesign;
