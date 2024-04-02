import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import "./OneDesign.css";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const FIGMATOKEN = import.meta.env.VITE_FIGMATOKEN;

//Retriving the design
const OneDesign = () => {
  const [design, setDesign] = useState();
  const [client, setClient] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [selectedTemplate, setselectedTemplate] = useState({});
  const [selectedFrame, setSelectedFrame] = useState({});
  let newThumbnailURL = "";
  const navigate = useNavigate(); // Use useNavigate hook to get the navigation function
  const uniqueImageNames = new Set();
  const [newText, setNewText] = useState([]);
  const [svg, setSvg] = useState(null);
  const [templateReady, setTemplateReady] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [scale, setScale] = useState(4);
  const { user, isLoggedIn, authenticateUser } = useContext(AuthContext);
  const { id, section, frame } = useParams();
  //console.log("bonjour render", id, section, frame);
  //-------------! Function to retrive datas !-------------

  const getDesign = async () => {
    try {
      const res = await axios
        .get(`${BACKEND_URL}/api/designs/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log("succegul retrieved from db", res.data);
          setDesign(res.data);
          setClient(res.data.usedBy);

          const sectionIndex = res.data.sections.findIndex(
            (s) => s.name === section
          );

          if (sectionIndex !== -1) {
            // If the section is found, use the found section
            setselectedTemplate(res.data.sections[sectionIndex]);
            if (frame) {
              const frameIndex = res.data.sections[
                sectionIndex
              ].frames.findIndex((s) => s.frameName === frame);

              setSelectedFrame(
                res.data.sections[sectionIndex].frames[frameIndex]
              );
            } else {
              setSelectedFrame(res.data.sections[sectionIndex].frames[0]);
            }
          } else {
            // If the section is not found, use the first section as a fallback
            setselectedTemplate(res.data.sections[0]);
            setSelectedFrame(res.data.sections[0].frames[0]);
          }
          setNewText(res.data.variables);
        });
    } catch (error) {
      console.log("there is an error", error);
      navigate("/notfound");
    }
  };

  //Download the design

  const dowloadDesign = async (idToDownload) => {
    console.log(
      "Starting the download with params",
      idToDownload,
      scale,
      design.FigmaFileKey
    );
    try {
      const response = await axios.get(
        `https://api.figma.com/v1/images/${design.FigmaFileKey}?ids=${idToDownload}&format=png&scale=${scale}`,
        {
          headers: {
            "X-Figma-Token": FIGMATOKEN,
          },
        }
      );
      //console.log(response.data.images);
      // Get the URL directly from the images object
      console.log("The URL of the image", response.data.images[idToDownload]);
      sendPNGURLToBackend(response.data.images[idToDownload]);
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", response.data.images[idToDownload], true);
        xhr.responseType = "blob";

        xhr.onload = function () {
          const blob = xhr.response;
          // Create a link element
          const link = document.createElement("a");
          // Set link properties
          link.href = window.URL.createObjectURL(blob);
          link.download = `${design.FigmaName}-${selectedTemplate.name}-${selectedFrame.frameName}.png`;
          // Append the link to the body and trigger the click event
          document.body.appendChild(link);
          link.click();

          // Remove the link from the body
          document.body.removeChild(link);
        };

        xhr.send();
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const dowloadTemplate = async (idToDownload) => {
    setLoadingMessage("Waiting for Figma response");
    try {
      // Make the initial GET request to Figma API
      const figmaApiResponse = await axios
        .get(
          `https://api.figma.com/v1/images/${design.FigmaFileKey}?ids=${idToDownload}&format=svg&scale=1&svg_include_id=true&svg_include_node_id=true`,
          {
            headers: {
              "X-Figma-Token": FIGMATOKEN,
            },
          }
        )
        .then(async (res) => {
          setLoadingMessage("Downloading informations from Figma response");
          console.log(
            "Download response : ",
            res.data.images[Object.keys(res.data.images)[0]]
          );
          newThumbnailURL = res.data.images[Object.keys(res.data.images)[0]];
          const svgData = await fetch(
            res.data.images[Object.keys(res.data.images)[0]]
          ).then((res) => res.text());
          setSvg(svgData);
          setTemplateReady(true);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sendPNGURLToBackend = async (urlToUpdate) => {
    try {
      // Send PNG URL data to the backend using axios.post
      await axios.post(
        `${BACKEND_URL}/api/designs/${id}`,
        {
          thumbnailURL: urlToUpdate,
          selectedFrame: selectedFrame,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error sending SVG data to the backend:", error);
    }
  };

  //-------------! Function to make changes !-------------

  //Function for the editing

  const generateDesign = async (event) => {
    setLoadingMessage("Starting Generating");
    event.preventDefault();
    setTemplateReady(false);
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
          console.log("reponse from generating ", res.data);
          setLoadingMessage("Request sent to backend");
          setTimeout(() => {
            dowloadTemplate(selectedFrame.frameId);
          }, 1000);

          //Resetting the input
          const inputFile = document.getElementById("fileInput");
          if (inputFile) {
            inputFile.value = ""; // Reseet the value as an empty string
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  //-------------! Handling functions !-------------
  function handleFile(event, name) {
    console.log(event.target.files);
    const newPicture = {
      name: name,
      file: event.target.files[0],
    };
    // Add the new picture to the existing pictures array
    setPictures((prevPictures) => [...prevPictures, newPicture]);
  }

  const handleInputFocus = (svgId, hasFocus) => {
    const element = document.getElementById(svgId);
    //console.log("element", element);
    if (element) {
      element.classList.toggle("active", hasFocus);
    }
  };

  async function handleNotify(event) {
    event.preventDefault();
    console.log("Should notify", client[0], client[0]._id);

    try {
      const res = await axios
        .get(`${BACKEND_URL}/api/designs/notify/${client[0]._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log("res", res);
        });
    } catch (error) {
      console.log("there is an error", error);
      //
    }
  }

  const handleDelete = async (event) => {
    event.preventDefault();
    const userConfirmed = window.confirm("Are you sure you want to delete?");
    if (!userConfirmed) {
      // User canceled the deletion
      return;
    } //Confirmation
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

  //-------------! End of handling functions !-------------

  // The Page generation
  useEffect(() => {
    getDesign();
  }, []);

  useEffect(() => {
    setTemplateReady(false);
    // console.log("le selected frame", selectedFrame.frameId);
    dowloadTemplate(selectedFrame.frameId);
  }, [selectedFrame]);

  if (!design) {
    return <div>{loadingMessage}</div>;
  }

  return (
    <>
      {/* <h1>{design.FigmaName}</h1> Display name of actual frame */}
      <div className="mainFrame">
        {
          // Displaying all the sections and all the frame in "select form", and setting also default values in selectedFrame and selectedTemplace states
        }
        <form className="main-gui">
          <div className="gui-el-wrapper">
          <h1>{selectedTemplate.name}</h1>

            {/* <select
              value={selectedTemplate.name}
              onChange={(e) => {
                // setTodownload(null);
                const selectedSectionName = e.target.value;
                const selectedSection = design.sections.find(
                  (section) => section.name === selectedSectionName
                );
                setselectedTemplate(selectedSection);
                if (selectedSection && selectedSection.frames.length > 0) {
                  setSelectedFrame(selectedSection.frames[0]);
                } else {
                  // Si la nouvelle section n'a pas de frame, effacer la frame sélectionné
                  setSelectedFrame(null);
                }
              }}
            >
              {design.sections.map((section, index) => {
                return (
                  <option key={section.name} value={section.name}>
                    {section.name}
                  </option>
                );
              })}
            </select> */}

            <select
              className="select-wrapper"
              value={selectedFrame.frameName}
              onChange={(e) => {
                const selectedFrameName = e.target.value;
                const selectedFrameToFind = selectedTemplate.frames.find(
                  (frame) => frame.frameName === selectedFrameName
                );
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
          </div>
          <div className="gui-el-wrapper">
            {
              //Displaying correctly all the variables
            }

            {design.variables.map((element, index) => {
              //console.log(element.name, selectedFrame);
              if (
                (element.name
                  .toLowerCase()
                  .includes(selectedTemplate.name.toLowerCase()) &&
                  element.name
                    .toLowerCase()
                    .includes(selectedFrame.frameName.toLowerCase())) ||
                (element.name
                  .toLowerCase()
                  .includes(selectedTemplate.name.toLowerCase()) &&
                  element.name.toLowerCase().includes("all"))
              ) {
                return (
                  <div className="input-wrapper">
                    <label key={index}>{element.name.split(" - ")[1]}</label>
                    <textarea
                      value={newText[index].valuesByMode}
                      type={newText[index].type}
                      onFocus={() =>
                        handleInputFocus(element.name.split(" - ")[1])
                      }
                      onBlur={() =>
                        handleInputFocus(element.name.split(" - ")[1], false)
                      }
                      onChange={(val) => {
                        console.log("salut la val et l'index", index);
                        let temp = [...newText];
                        temp[index].valuesByMode = val.target.value;
                        setNewText(temp);
                        //console.log(temp);
                      }}
                    />
                  </div>
                );
              }
            })}

            {design.images.map((element, index) => {
              // console.log("mapping images", element);
              const handleFileWithInfo = (event) => {
                handleFile(event, element.name);
              };

              // Check if the name is already displayed, if not, display it and add to the set
              if (
                (!uniqueImageNames.has(element.name) &&
                  element.name
                    .toLowerCase()
                    .includes(selectedTemplate.name.toLowerCase()) &&
                  element.name
                    .toLowerCase()
                    .includes(selectedFrame.frameName.toLowerCase())) ||
                (element.name
                  .toLowerCase()
                  .includes(selectedTemplate.name.toLowerCase()) &&
                  element.name.toLowerCase().includes("all"))
              ) {
                uniqueImageNames.add(element.name); // Add the name to the set
                return (
                  <div className="input-wrapper" key={element.name}>
                    <label>{element.name.split(" - ")[1]}</label>
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

          <button className="btn generate-image" onClick={generateDesign}>
            Generate the image
          </button>

          <div className="footer-wrapper">
            <div className="input-wrapper resolution">
              <label>Export Resolution: {scale}</label>
              <div className="resolution-manager">
                <div
                  className={`scale-option ${scale === 4 ? "active" : ""}`}
                  onClick={() => setScale(4)}
                >
                  High
                </div>
                <div
                  className={`scale-option ${scale === 3 ? "active" : ""}`}
                  onClick={() => setScale(3)}
                >
                  Medium
                </div>
                <div
                  className={`scale-option ${scale === 2 ? "active" : ""}`}
                  onClick={() => setScale(2)}
                >
                  Low
                </div>
              </div>
            </div>

            <button
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                dowloadDesign(selectedFrame.frameId);
              }}
            >
              Download Assets
            </button>
          </div>

          {isLoggedIn && user.status === "admin" && (
            <button className="btn" onClick={handleNotify}>
              Notify Client
            </button>
          )}

          {/* <button className="btn" onClick={handleDelete}>
            Delete
          </button> */}
        </form>

        <div className="preview">
          {!templateReady ? (
            <p className="loadingMessage"> {loadingMessage} </p>
          ) : (
            <>
              <div>
                <div
                  className="svgDiv"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OneDesign;
