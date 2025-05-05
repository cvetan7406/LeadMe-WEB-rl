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

import { useState, useEffect, useMemo } from "react";
import React from "react";
import ReactGA from 'react-ga4'; // Import react-ga
import ChatIcon from '@mui/icons-material/Chat';

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";


// Vision UI Dashboard React components
import VuiBox from "./components/VuiBox";

// Vision UI Dashboard React example components
import Sidenav from "./examples/Sidenav";
import ChatAI from "./examples/ChatAI";

// Vision UI Dashboard React themes
import theme from "./assets/theme";
import themeRTL from "./assets/theme/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Vision UI Dashboard React routes
import routes from "./routes.jsx";
// Authentication pages
import SignIn from "./layouts/authentication/sign-in";
import SignUp from "./layouts/authentication/sign-up";

import { useVisionUIController, setMiniSidenav, setOpenConfigurator } from "./context";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";
import { FilterProvider } from "./context/FilterContext";
import NotificationToast from "./components/NotificationToast";

export default function App() {
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Initialize Google Analytics page view tracking
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: pathname });
  }, [pathname]);

  // Filter out authentication routes from main routes to prevent conflicts
  const getFilteredRoutes = (allRoutes) => {
    let renderedRoutes = [];
    
    allRoutes.forEach((route) => {
      if (route.collapse) {
        // For collapsed routes, recursively get their routes
        const collapsedRoutes = getFilteredRoutes(route.collapse);
        renderedRoutes = [...renderedRoutes, ...collapsedRoutes];
      } else if (route.route && !route.route.startsWith('/authentication')) {
        // Add single route, but skip authentication routes
        renderedRoutes.push(
          <Route path={route.route} element={<route.component />} key={route.key} />
        );
      }
    });
    
    return renderedRoutes;
  };

  const configsButton = (
    <VuiBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="info"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="white"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <ChatIcon fontSize="default" color="inherit" />
    </VuiBox>
  );

  const renderApp = () => (
    direction === "rtl" ? (
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={themeRTL}>
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand="LeadVision Ltd."
                brandName="LeadVision ."
                routes={routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              <ChatAI />
              {configsButton}
            </>
          )}
          {layout === "vr" && <ChatAI />}
          <Routes>
            {getFilteredRoutes(routes)}
            <Route path="/authentication/sign-in" element={<SignIn />} />
            <Route path="/authentication/sign-up" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </ThemeProvider>
      </CacheProvider>
    ) : (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand="LeadVision Ltd."
              brandName=""
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <ChatAI />
            {configsButton}
          </>
        )}
        {layout === "vr" && <ChatAI />}
        <Routes>
          {getFilteredRoutes(routes)}
          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/authentication/sign-in" element={<SignIn />} />
          <Route path="/authentication/sign-up" element={<SignUp />} />
          
        </Routes>
      </ThemeProvider>
    )
  );

  return (
    <AuthProvider>
      <NotificationProvider>
        <FilterProvider>
          <NotificationToast />
          {renderApp()}
        </FilterProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
