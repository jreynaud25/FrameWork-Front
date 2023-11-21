import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const FIGMATOKEN = import.meta.env.VITE_FIGMATOKEN;

//Retriving the design
const OneDesign = () => {
  const [design, setDesign] = useState();
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
          console.log("got the deisgn", res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  //Download the design
  const dowloadDesign = async (setChange) => {
    try {
      const res = await axios
        .get(
          `https://api.figma.com/v1/images/${design.figmaID}?ids=${design.figmaNodeIDs}&format=png`,
          {
            headers: {
              "X-Figma-Token": FIGMATOKEN,
              //"X-Figma-Token": "figd_p_oI7cST7l_VVrHfc-howqf0NbXaVadEHb9vBZC3",
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
  const generateDesign = async () => {
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
  // The Page generation
  useEffect(() => {
    getDesign();
  }, []);

  if (!design) {
    return <div>Loading...</div>;
  }
  dowloadDesign();

  return (
    <div>
      <p>{design.name}</p>
      <div>
        {!toDownload ? (
          <div> Loading... </div>
        ) : (
          <img src={toDownload} alt={design.name} width={300} />
        )}
        {/* <p>{design.figmaID}</p>
        <p>{design.figmaNodeIDs}</p> */}

        <form>
          {design.textValues.map((element, index) => {
            return (
              <label key={element}>
                <input
                  placeholder={element}
                  onChange={(val) => {
                    console.log("salut la val et l'index", index);
                    let temp = newText;
                    temp[index] = val.target.value;
                    setNewText(temp);
                    console.log(temp);
                  }}
                />
              </label>
            );
          })}

          <div>
            <label htmlFor="picture">Picture:</label>
            <input type="file" onChange={handleFile} />
          </div>
        </form>
        {!isGenerated ? (
          <button onClick={generateDesign}>Generate the image</button>
        ) : (
          <a href={toDownload} download>
            Downlaod
          </a>
        )}
      </div>
    </div>
  );
};

export default OneDesign;
