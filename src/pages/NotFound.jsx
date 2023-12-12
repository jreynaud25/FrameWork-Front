import React from "react";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h3>
        It looks like there is nothing here, 404. Check your url, or go back{" "}
      </h3>
      <NavLink to={"/designs"}>
        <h1>Designs.</h1>
      </NavLink>
    </div>
  );
};

export default NotFound;
