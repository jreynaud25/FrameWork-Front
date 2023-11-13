import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const OneDuck = () => {
  const [duck, setDuck] = useState();
  const { id } = useParams();
  const getDuck = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/designs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDuck(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDuck();
  }, []);

  if (!duck) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>{duck.name}</p>
      <div>
        <img src={duck.picture} alt={duck.name} width={300} />
      </div>
    </div>
  );
};

export default OneDuck;
