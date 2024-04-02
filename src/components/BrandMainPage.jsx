import React from "react";

function BrandMainPage(props) {
  const { brandData } = props;

  const renderElements = (elements, level = 0) => {
    // console.log("le level", level);
    return elements.map((element, index) => (
      //<div key={index}>
      <div
        key={index}
        className={element.name === "Sub-pages" ? `main` : ``}
        id={element.nodeid}
      >
        {element.characters && (
          <p id={`${element.nodeid}`}>
            {getTabulation(level)}
            {element.characters}
          </p>
        )}
        {/* {element.name && (
          <p>
            {getTabulation(level)}
            {element.name}
          </p>
        )} */}
        {element.elements && (
          <div>
            {element.name}
            {getTabulation(level)}
            {renderElements(element.elements, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const getTabulation = (level) => {
    return Array(level).fill("\u00A0\u00A0\u00A0\u00A0").join(""); // You can adjust the number of spaces as needed
  };

  return (
    <div>
      {brandData && (
        <div>
          <div className="main">{renderElements(brandData.elements)}</div>
        </div>
      )}
    </div>
  );
}

export default BrandMainPage;
