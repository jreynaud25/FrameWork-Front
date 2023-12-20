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
  const uniqueImageNames = new Set();
  const [newText, setNewText] = useState([]);
  const [toDownload, setTodownload] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [pictures, setPictures] = useState([]);

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
          console.log("got the deisgn", res.data, res.data.variables);
          setNewText(res.data.variables);
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
          `https://api.figma.com/v1/images/${design.FigmaFileKey}?ids=${design.FigmaId}&format=png`,
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
    // fd.append("picture", picture);
    pictures.forEach((picture, index) => {
      //console.log(picture.file);
      fd.append("pictures", picture.file, picture.name);
    });
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

  function handleFile(event, name) {
    console.log(event.target.files);
    console.log("can i get index", name);

    const newPicture = {
      name: name,
      file: event.target.files[0],
    };

    // Add the new picture to the existing pictures array
    setPictures((prevPictures) => [...prevPictures, newPicture]);
  }
  function handleArchive() {
    console.log("Start archiving");
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
    if (design) {
      dowloadDesign();
    }
  }, [design]);

  if (!design) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{design.FigmaName}</p>
      <div>
        {!toDownload ? (
          <div> Loading... </div>
        ) : (
          <img src={toDownload} alt={design.FigmaName} width={300} />
        )}

        <form>
          {design.variables.map((element, index) => {
            return (
              <label key={index}>
                {element.name}
                {/* <input
                  value={newText[index].valuesByMode["250:0"]}
                  type={newText[index].type}
                  onChange={(val) => {
                    console.log("salut la val et l'index", index);
                    let temp = [...newText];
                    temp[index] = val.target.value;
                    setNewText(temp);
                    console.log(temp);
                  }}
                /> */}
              </label>
            );
          })}

          <div>Useb by</div>
          {clients.map((client) => {
            return <div key={client.username}>{client.username}</div>;
          })}
          <div>
            <label htmlFor="picture">Picture:</label>

            {design.images.map((element, index) => {
              const handleFileWithInfo = (event) => {
                handleFile(event, element.name);
              };

              // Check if the name is already displayed, if not, display it and add to the set
              if (!uniqueImageNames.has(element.name)) {
                uniqueImageNames.add(element.name); // Add the name to the set
                return (
                  <div key={element.name}>
                    {element.name}{" "}
                    <input type="file" onChange={handleFileWithInfo} />
                  </div>
                );
              }
            })}
          </div>
          <button className="btn" onClick={generateDesign}>
            Generate the image
          </button>
          {toDownload && (
            <a className="btn" href={toDownload}>
              Downlaod
            </a>
          )}

          {toDownload && (
            <button className="btn" onClick={handleArchive}>
              Archive
            </button>
          )}
          <button className="btn" onClick={handleDelete}>
            Delete
          </button>
        </form>
      </div>
    </div>
  );
};

export default OneDesign;
