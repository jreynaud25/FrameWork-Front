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

````bash
 env
 Copy code
 VITE_BACKEND_URL=http://localhost:3000
 VITE_FIGMATOKEN=<your-figma-token>
 Start the development server:

```bash
Copy code
npm run dev
Usage
Components:
Select Section:

Dropdown menu to select a design section.
Default selection based on the :section parameter from the URL.
Select Frame:

Dropdown menu to select a frame within the chosen section.
Default selection based on the first frame in the selected section.
Edit Text:

Textareas for each variable in the design.
Text data can be input and edited.
Upload Pictures:

File input for each image in the design.
Pictures can be uploaded for customization.
Scale Adjustment:

Input field to adjust the scale between 0.01 and 4.
Scale value is displayed and can be modified.
Generate Image:

Button to generate a new design based on user inputs.
Initiates a download of the generated design.
Download Frame:

Button to download the currently selected frame.
Delete Design:

Button to delete the entire design.
Preview:
Displays a preview of the generated design.
Dependencies
React: A JavaScript library for building user interfaces.
React Router: Declarative routing for React.js.
Axios: Promise-based HTTP client for the browser and Node.js.
Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

License
This project is licensed under the MIT License.
````
