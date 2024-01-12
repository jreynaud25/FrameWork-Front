import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Designs = () => {
  const { user, isLoggedIn, authenticateUser } = useContext(AuthContext);
  const [designs, setDesigns] = useState([]);
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

  const getDesigns = async () => {
    try {
      const allDesigns = await axios.get(`${BACKEND_URL}/api/designs/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDesigns(allDesigns.data);
      console.log("les designs", allDesigns.data);
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
      console.log("les designs", allDesigns.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user.status === "admin") {
      getDesigns();
      fetchClients();
    } else {
      getOwnedDesigns();
    }
  }, []);

  if (!designs || !clients) {
    return <div>Loading...</div>;
  }

  //  console.log("lest clients", clients);
  return (
    <div>
      {isLoggedIn && user.status === "admin" && (
        <div className="btn">
          <Link to={"/Designs/create"}>Create Desgins </Link>
        </div>
      )}

      {user.status === "admin" &&
        clients.map((client) => {
          return (
            <div>
              <h2 key={client.username}> {client.username}</h2>
              {designs.map((design) => {
                if (design.usedBy.includes(client._id)) {
                  return (
                    <>
                      <Link key={design._id} to={design._id}>
                        <div className="btn">{design.FigmaName}</div>
                      </Link>
                      {design.sections.map((section) => {
                        console.log("bonjours", section);
                        return (
                          <Link key={section._id} to={design._id}>
                            <div className="btn">{section.name}</div>
                          </Link>
                        );
                      })}
                    </>
                  );
                }
                // } else {
                //   return (
                //     <Link key={design._id} to={design._id}>
                //       <div className="btn">{design.FigmaName}</div>
                //     </Link>
                //   );
                // }
              })}
            </div>
          );
        })}

      {user.status != "admin" &&
        designs.map((design) => {
          return (
            <>
              <Link key={design._id} to={design._id}>
                <div className="btn">{design.FigmaName}</div>
              </Link>
              {design.sections.map((section) => {
                console.log("bonjours", section);
                return (
                  <Link key={section._id} to={design._id}>
                    <div className="btn">{section.name}</div>
                  </Link>
                );
              })}
            </>
          );
        })}
    </div>
  );
};

export default Designs;
