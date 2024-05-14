import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import "./Designs.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Designs = () => {
  const { user, isLoggedIn, authenticateUser } = useContext(AuthContext);
  const [designs, setDesigns] = useState([]);
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/client`);
      // console.log("les clients", response);
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
      // console.log("les designs", allDesigns.data);
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

      {user.status === "admin" &&
        clients.map((client) => {
          return (
            <div className="design-list-wrapper">
              <h5 key={client.username}> {client.username}</h5>
              {designs.map((design) => {
                if (design.usedBy.includes(client._id)) {
                  return (
                    <>
                      <Link key={design._id} to={design._id}>
                        <div className="btn">{design.FigmaName}</div>
                      </Link>
                      {design.sections.map((section) => {
                        //console.log("bonjours", section);
                        return (
                          <>
                            <Link
                              key={section._id}
                              to={`${design._id}/${section.name}`}
                            >
                              <div className="btn title">{section.name}</div>
                            </Link>
                            <div className="images-wrapper">
                              {section.frames.map((frame) => {
                                return (
                                  <Link
                                    to={`${design._id}/${section.name}/${frame.frameName}`}
                                    className="image-wrapper"
                                  >
                                    <p>{frame.frameName}</p>
                                    <img src={frame.thumbnailURL}></img>
                                  </Link>
                                );
                              })}
                            </div>
                          </>
                        );
                      })}
                    </>
                  );
                }
              })}
            </div>
          );
        })}

      {user.status != "admin" &&
        designs.map((design) => {
          return (
            <div className="design-list-wrapper">
              <Link key={design._id} to={design._id}>
                {/* <div className="btn title">{design.FigmaName}</div> */}
              </Link>
              {design.sections.map((section) => {
                //console.log("bonjours", section);
                return (
                  <>
                    <Link
                      key={section._id}
                      to={`${design._id}/${section.name}`}
                    >
                      <div className="btn title">{section.name}</div>
                    </Link>
                    <div className="images-wrapper">
                      {section.frames.map((frame) => {
                        return (
                          <Link
                            to={`${design._id}/${section.name}/${frame.frameName}`}
                            className="image-wrapper"
                          >
                            <div className="text-wrapper">
                              <h3>{frame.frameName}</h3>
                              <h4>Start Editing</h4>
                            </div>
                            <img src={frame.thumbnailURL}></img>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

export default Designs;
