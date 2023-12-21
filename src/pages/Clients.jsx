import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Clients = () => {
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/client`);
      console.log("les clients", response);
      setClients(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    console.log("should delete client with id:", id);
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/client/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Deleted client:", response.data);
      fetchClients();
      // After successful deletion, you can update the clients list in your state or perform any other actions.
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h2>Clients:</h2>
      <div className="container">
        La list de clients
        {clients.map((client) => {
          return (
            <div key={client._id} className="card">
              <p>
                {client.username} {client.status} {client.email}{" "}
                <button onClick={() => handleDelete(client._id)}>Delete</button>
              </p>
            </div>
          );
        })}
      </div>
      <div>
        
          <NavLink to={"/auth/create"}>
            <button className="btn">Ajouter Client </button>
          </NavLink>
        
      </div>
    </div>
  );
};

export default Clients;
