import React from "react";

function BrandMainPage(props) {
  const { brandData, brandImages } = props;
  //console.log(brandImages.images);
  const renderElements = (elements, level = 0) => {
    return elements.map((element, index) => {
      //console.log("Looping on elements, i got", element.characters, element.nodeid)
      console.log(brandImages.images[element.name]);
      return (
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
          {element.elements && element.name.length > 0 && (
            <div>
              {/* {element.name}
              {element.nodeid} */}
              {getTabulation(level)}
              {!brandImages.images[element.name] &&
                renderElements(element.elements, level + 1)}
              {brandImages.images[element.name] && (
                <img
                  src={brandImages.images[element.name].url}
                  alt={element.nodeid}
                />
              )}
            </div>
          )}
        </div>
      );
    });
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
