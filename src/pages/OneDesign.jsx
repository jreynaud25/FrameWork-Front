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
  const [selectedTemplate, setselectedTemplate] = useState({});
  const [selectedFrame, setSelectedFrame] = useState({});
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
          setselectedTemplate(res.data.sections[0]);
          setSelectedFrame(res.data.sections[0].frames[0]);
          console.log("got the deisgn", res.data, res.data.variables);
          setNewText(res.data.variables);
        });
    } catch (error) {
      console.log("there is an error", error);
      navigate("/notfound");
    }
  };

  //Download the design
  const dowloadDesign = async (idToDownload, setChange) => {
    console.log("Starting the download with params", idToDownload, setChange);
    setTodownload(null);
    try {
      const res = await axios
        .get(
          `https://api.figma.com/v1/images/${design.FigmaFileKey}?ids=${idToDownload}&format=png`,
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
    console.log("Je vais generer avec", newText);

    console.log("the type of ", typeof newText);
    fd.append("newText", JSON.stringify(newText));
    pictures.forEach((picture, index) => {
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
          //dowloadDesign(true);

          const inputFile = document.getElementById("fileInput"); // Add an ID to your input element
          if (inputFile) {
            inputFile.value = ""; // Set the value to an empty string
          }
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
    // console.log(
    //   ` shloud download   https://api.figma.com/v1/images/${design.FigmaFileKey}?ids=${selectedTemplate.id}&format=png`
    // );

    if (design) {
      //  dowloadDesign(selectedTemplate.id);
    }
  }, [selectedTemplate]);

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
        <label htmlFor="selectedTemplate">Template</label>

        <form>
          <select
            value={selectedTemplate.name}
            onChange={(e) => {
              setTodownload(null);
              const selectedSectionName = e.target.value;
              const selectedSection = design.sections.find(
                (section) => section.name === selectedSectionName
              );
              console.log(selectedSection);
              setselectedTemplate(selectedSection);
            }}
          >
            {design.sections.map((section, index) => {
              return (
                <option key={section.name} value={section.name}>
                  {section.name}
                </option>
              );
            })}
          </select>
          {/* {design.variables.map((element, index) => {
            return (
              <label key={index}>
                {element.name.split(" - ")[1]}
                <input
                  value={newText[index].valuesByMode}
                  type={newText[index].type}
                  onChange={(val) => {
                    console.log("salut la val et l'index", index);
                    let temp = [...newText];
                    temp[index].valuesByMode = val.target.value;
                    setNewText(temp);
                    //console.log(temp);
                  }}
                />
              </label>
            );
          })} */}

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
                    {element.name.split(" - ")[1]}
                    <input
                      id="fileInput"
                      type="file"
                      onChange={handleFileWithInfo}
                    />
                  </div>
                );
              }
            })}
          </div>
          <button className="btn" onClick={generateDesign}>
            Generate the image
          </button>

          <label htmlFor="selectDownload">Select Download</label>
          {console.log("checking the selected frame", selectedFrame)}
          <select
            value={selectedFrame.frameName}
            onChange={(e) => {
              setTodownload(null);
              const selectedFrameName = e.target.value;
              const selectedFrameToFind = selectedTemplate.frames.find(
                (frame) => frame.frameName === selectedFrameName
              );
              console.log("la selected frame", selectedFrameToFind);
              setSelectedFrame(selectedFrameToFind);
            }}
          >
            {selectedTemplate.frames.map((frame, index) => {
              return (
                <option key={frame.frameName} value={frame.frameName}>
                  {frame.frameName}
                </option>
              );
            })}
          </select>
          <br />

          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("bonjour le click", selectedFrame.frameId);
              dowloadDesign(selectedFrame.frameId);
            }}
          >
            Download {selectedFrame.frameName}
          </button>

          <br />
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
