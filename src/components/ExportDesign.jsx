import axios from "axios";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "../context/authContext";

function ExportDesign(props) {
  const [scale, setScale] = useState(4);
  const [downloadReady, setDownloadReady] = useState(true);
  const { user, isLoggedIn } = useContext(AuthContext);
  const { id } = useParams();
  const { selectedFrame, selectedTemplate, design, client } = props;
  const FIGMATOKEN = import.meta.env.VITE_FIGMATOKEN;
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  //Function for the editing

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

  //Download the design

  const dowloadDesign = async (idToDownload) => {
    console.log(
      "Starting the download with params",
      idToDownload,
      scale,
      design.FigmaFileKey
    );
    setDownloadReady(false);
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
    setDownloadReady(true);
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
      console.error("Error sending PNG data to the backend:", error);
    }
  };
  return (
    <>
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
          Download Assets{" "}
          <div className={`loader ${!downloadReady ? "" : "hidden"}`}></div>
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
    </>
  );
}

export default ExportDesign;
