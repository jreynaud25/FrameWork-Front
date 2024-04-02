import React from "react";

function BrandMainPage(props) {
  const { brandData } = props;

  const renderElements = (elements, level = 0) => {
   // console.log("le level", level);
    return elements.map((element, index) => (
      <div key={index}>
        <h1 id={element.name}>
          {getTabulation(level)}
          {element.name} {level} Type: {element.type}
        </h1>
        {element.characters && (
          <p>
            {getTabulation(level)}Characters: {element.characters}
          </p>
        )}
        {element.elements && (
          <div>
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
          <p>Figma Name: {brandData.FigmaName}</p>
          <p>Figma Id: {brandData.FigmaId}</p>
          <div>{renderElements(brandData.elements)}</div>
        </div>
      )}
    </div>
  );
}

export default BrandMainPage;
