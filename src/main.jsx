/**
=========================================================
* Material Tailwind Dashboard React - v2.1.0
=========================================================
* Product Page: https://www.creative-tim.com/product/material-tailwind-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-tailwind-dashboard-react/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import "../public/css/tailwind.css";
import { UserProvider } from "./context/userContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from "./reduxToolkit/store";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import { DndProvider } from "react-dnd";
import WrapperProject from "./pages/context/serviceProject";
import WrapperMembers from "./pages/context/serviceMembre";
import { ChakraProvider } from "@chakra-ui/react";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MaterialTailwindControllerProvider>
     
          <UserProvider>
      
            <GoogleOAuthProvider clientId="551424376539-utblai5fvatj1929pov7qicdqruoeju2.apps.googleusercontent.com">
           
            <WrapperProject>
                  <WrapperMembers>
            <DndProvider backend={HTML5Backend}>
            {/* <ChakraProvider> */}
              <App />
              {/*</ChakraProvider> */}
              </DndProvider>
              </WrapperMembers>
                </WrapperProject>
            </GoogleOAuthProvider>
         
          </UserProvider>
       
        </MaterialTailwindControllerProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
  </Provider>
  
);
