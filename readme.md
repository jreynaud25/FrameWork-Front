# OneDesign React Component

## Description

The `OneDesign` component is a React component used to display and interact with design data fetched from a backend. It allows users to select a design section and frame, input text data, upload pictures, adjust scale, generate a new design, and download the result.

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>

   ```

2. **Create a .env file at the root of your project.**

Add the following environment variables:
Set up environment variables:

```bash
.env
 VITE_BACKEND_URL=http://localhost:3000
 VITE_FIGMATOKEN=<your-figma-token>

```

```bash
Copy code
npm run dev
Usage
Components:
Select Section:

```

3. **The functions**

First the useEffect launch the getDesign() function.

```bash
  useEffect(() => {
    getDesign();
  }, []);

```

The **_getDesign()_** function ake an axios get to the backend. And set 4 states (design/selectedTemplate/selectedFrame/newText)

It then trigger a second useEffect(), which launch the download of the preview svg on the right of the screen. Setting **setTemplateReady(false);** make the loading appear.

```bash
  useEffect(() => {
    setTemplateReady(false);
    // console.log("le selected frame", selectedFrame.frameId);
    dowloadTemplate(selectedFrame.frameId);
  }, [selectedFrame]);

```

**downloadTemplate()** is retriving the svg from the figma API

```bash


  //Download the Template
  const dowloadTemplate = async (idToDownload, setChange) => {
    // console.log("Downloading the template with id", idToDownload);
    try {
      const res = await axios
        .get(
          `https://api.figma.com/v1/images/${design.FigmaFileKey}?ids=${idToDownload}&format=svg&scale=1&svg_include_id=true&svg_include_node_id=true`,
          {
            headers: {
              "X-Figma-Token": FIGMATOKEN,
            },
          }
        )
        .then(async (res) => {
          const svgData = await fetch(
            res.data.images[Object.keys(res.data.images)[0]]
          ).then((res) => res.text());
          setSvg(svgData);
          setTemplateReady(true);
        });
    } catch (error) {
      console.log(error);
    }
  };


```

**The HTML returned**

Note that all the Sections and Frames of your figma file will be displayed.

**_Variables_**

Bellow you can see the code. Note that, every variable with the name of the frame and/or with the keywork "all" will be displayed. It's the same for the images

```bash

   {design.variables.map((element, index) => {
            //console.log(element.name, selectedFrame);
            if (
              (element.name
                .toLowerCase()
                .includes(selectedTemplate.name.toLowerCase()) &&
                element.name
                  .toLowerCase()
                  .includes(selectedFrame.frameName.toLowerCase())) ||
              (element.name
                .toLowerCase()
                .includes(selectedTemplate.name.toLowerCase()) &&
                element.name.toLowerCase().includes("all"))
            )

```