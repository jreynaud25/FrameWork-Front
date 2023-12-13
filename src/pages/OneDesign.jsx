import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate, Navigate } from "react-router-dom";
// import { AuthContext } from "../context/authContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const FIGMATOKEN = import.meta.env.VITE_FIGMATOKEN;

//Retriving the design
const OneDesign = () => {
  const [design, setDesign] = useState();
  const [clients, setClients] = useState("");
  // const { user, isLoggedIn, authenticateUser } = useContext(AuthContext);
  const navigate = useNavigate(); // Use useNavigate hook to get the navigation function

  const [newText, setNewText] = useState([]);
  const [toDownload, setTodownload] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [picture, setPicture] = useState("");

  const { id } = useParams();
  const getDesign = async () => {
    try {
      const res = await axios
        .get(`${BACKEND_URL}/api/designs/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setDesign(res.data);
          setClients(res.data.usedBy);
          console.log("got the deisgn", res.data, res.data.usedBy);
          setNewText(res.data.textValues);
        });
    } catch (error) {
      console.log("there is an error", error);
      navigate("/notfound");
    }
  };

  //Download the design
  const dowloadDesign = async (setChange) => {
    try {
      const res = await axios
        .get(
          `https://api.figma.com/v1/images/${design.figmaID}?ids=${design.figmaFrameID}&format=png`,
          {
            headers: {
              "X-Figma-Token": FIGMATOKEN,
            },
          }
        )
        .then((res) => {
          setTodownload(res.data.images[Object.keys(res.data.images)[0]]);
          if (setChange) {
            setIsGenerated(true);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  //Generate the new design
  const generateDesign = async (event) => {
    event.preventDefault();
    const fd = new FormData();
    fd.append("newText", newText);
    fd.append("picture", picture);

    try {
      const res = await axios
        .patch(`${BACKEND_URL}/api/designs/${id}`, fd, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          // setDesign(res.data);
          console.log("reponse from generating ", res.data);
          dowloadDesign(true);
        });
    } catch (error) {
      console.log(error);
    }
  };

  function handleFile(event) {
    console.log(event.target.files);
    setPicture(event.target.files[0]);
  }
  const handleDelete = async (event) => {
    console.log("Handle delete");
    event.preventDefault();

    try {
      const res = await axios
        .delete(`${BACKEND_URL}/api/designs/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          // setDesign(res.data);
          console.log("reponse from generating ", res.data);
          navigate("/designs");
        });
    } catch (error) {
      console.log(error);
    }
  };

  // The Page generation
  useEffect(() => {
    getDesign();
  }, []);

  useEffect(() => {
    console.log("bonjour le download design dans le useeffects");
    dowloadDesign();
  }, [design]);

  if (!design) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{design.name}</p>
      <div>
        {!toDownload ? (
          <div> Loading... </div>
        ) : (
          <img src={toDownload} alt={design.name} width={300} />
        )}

        <form>
          {design.textValues.map((element, index) => {
            return (
              <label key={index}>
                Champ numéro {index + 1}
                <input
                  value={newText[index]}
                  onChange={(val) => {
                    console.log("salut la val et l'index", index);
                    let temp = [...newText];
                    temp[index] = val.target.value;
                    setNewText(temp);
                    console.log(temp);
                  }}
                />
              </label>
            );
          })}

          <div>Useb by</div>
          {clients.map((client) => {
            return <div>{client.username}</div>;
          })}
          <div>
            <label htmlFor="picture">Picture:</label>
            <input type="file" onChange={handleFile} />
          </div>
          <button className="btn" onClick={generateDesign}>
            Generate the image
          </button>
          <a className="btn" href={toDownload} Name="btn">
            Downlaod
          </a>
          <button className="btn" onClick={handleDelete}>
            Delete
          </button>
        </form>
      </div>
    </div>
  );
};

export default OneDesign;
