import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Clients = () => {
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/client`);
      console.log(response);
      setClients(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);
  return (
    <div>
      <h2>Clients:</h2>
      <div className="container">
        La list de clients
        {clients.map((client) => {
          return (
            <div key={client._id} className="card">
              <p>
                {client.username} {client.status}
              </p>
            </div>
          );
        })}
      </div>
      <div>
        <li>
          <NavLink to={"/auth/signup"}>Ajouter Client</NavLink>
        </li>
      </div>
    </div>
  );
};

export default Clients;
