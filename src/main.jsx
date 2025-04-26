/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software.

*/

import React from "react";
import { createRoot} from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ReactGA from 'react-ga4'; // Import react-ga

// Vision UI Dashboard React Context Provider
import { VisionUIControllerProvider } from "./context/index.jsx";

// Initialize Google Analytics
ReactGA.initialize('G-TDTY86LSH9'); // Replace with your tracking ID

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);


root.render(<BrowserRouter>
  <VisionUIControllerProvider>
    <App />
  </VisionUIControllerProvider>
</BrowserRouter>)

