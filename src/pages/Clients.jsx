import React, { useState, useEffect } from "react";
import axios from "axios";
const Clients = () => {
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/student");
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
        La lsit de designs
        {/* {students.map((student) => {
          return (
            <div key={student._id} className="card">
              <p>
                {student.username} {student.status}
              </p>
            </div>
          );
        })} */}
      </div>
    </div>
  );
};

export default Clients;
