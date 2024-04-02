import React, { useState } from "react";
// import "./SideMenu.css";
function SideMenu(props) {
  const { brandData } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  console.log("bonjou", brandData);
  return (
    <div className="SideMenu">
      {brandData && (
        <ul>
          {brandData.elements.map((element, index) => (
            <li key={index}>
              <a href={`#${element.name}`} className="link">{element.name}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SideMenu;
