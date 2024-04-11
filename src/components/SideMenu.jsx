import React, { useState } from "react";

function SideMenu(props) {
  const { brandData } = props;

  // Function to generate unique identifiers based on element hierarchy

  const renderMenuItems = (elements, parentIds = []) => {
    return elements.map((element, index) => {
      // Generate unique anchor id for the current element


      if (element.name === "Sub-pages" || element.name.startsWith("Page")) {
        return (
          <li key={index}>
            <a
              href={`#${element.nodeid}`}
              className="link"
              style={{ marginLeft: `${parentIds.length * 20}px` }}
            >
              {element.elements[0]?.characters}
            </a>
            {element.elements && (
              <ul>
                {renderMenuItems(element.elements, [
                  ...parentIds,
                  element.elements[0]?.characters,
                ])}
              </ul>
            )}
          </li>
        );
      }
    });
  };

  return (
    <div className="SideMenu">
      {brandData && <ul>{renderMenuItems(brandData.elements)}</ul>}
    </div>
  );
}

export default SideMenu;


