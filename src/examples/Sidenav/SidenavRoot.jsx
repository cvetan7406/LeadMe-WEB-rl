/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import linearGradient from "../../assets/theme/functions/linearGradient";

export default styled(Drawer)(({ theme, ownerState }) => {
  const { palette, boxShadows, transitions, breakpoints, functions } = theme;
  const { transparentSidenav, miniSidenav } = ownerState;

  const sidebarWidth = 250;
  const { transparent, gradients } = palette;
  const { xxl } = boxShadows;
  const { pxToRem } = functions;

  // styles for the sidenav when miniSidenav={false}
  const drawerOpenStyles = () => ({
    position: "fixed",
    height: "100vh",
    top: 0,
    left: 0,
    zIndex: 1000,
    overflowX: "hidden",
    transition: transitions.create(["width", "transform"], {
      easing: transitions.easing.sharp,
      duration: transitions.duration.standard,
    }),

    [breakpoints.up("xs")]: {
      width: "100%",
      transform: "translateX(0)",
    },

    [breakpoints.up("sm")]: {
      width: sidebarWidth,
      transform: "translateX(0)",
    },

    [breakpoints.up("md")]: {
      width: sidebarWidth,
      transform: "translateX(0)",
    },

    [breakpoints.up("xl")]: {
      width: sidebarWidth,
      transform: "translateX(0)",
      backgroundColor: transparentSidenav ? transparent.main : gradients.sidenav.main,
      boxShadow: transparentSidenav ? "none" : xxl,
    },
  });

  // styles for the sidenav when miniSidenav={true}
  const drawerCloseStyles = () => ({
    position: "fixed",
    height: "100vh",
    top: 0,
    left: 0,
    zIndex: 1000,
    overflowX: "hidden",
    transition: transitions.create(["width", "transform"], {
      easing: transitions.easing.sharp,
      duration: transitions.duration.standard,
    }),

    [breakpoints.up("xs")]: {
      width: pxToRem(80),
      transform: "translateX(0)",
    },

    [breakpoints.up("sm")]: {
      width: pxToRem(96),
      transform: "translateX(0)",
    },

    [breakpoints.up("md")]: {
      width: pxToRem(96),
      transform: "translateX(0)",
    },

    [breakpoints.up("xl")]: {
      width: pxToRem(96),
      transform: "translateX(0)",
      backgroundColor: transparentSidenav ? transparent.main : gradients.sidenav.main,
      boxShadow: transparentSidenav ? "none" : xxl,
    },
  });

  return {
    "& .MuiDrawer-paper": {
      boxShadow: xxl,
      border: "none",
      background: transparentSidenav
        ? transparent.main
        : linearGradient(
            gradients.sidenav.main,
            gradients.sidenav.state,
            gradients.sidenav.deg
          ),
      backdropFilter: transparentSidenav ? "unset" : "blur(120px)",
      ...(miniSidenav ? drawerCloseStyles() : drawerOpenStyles()),
      overflowX: "hidden",
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "rgba(255, 255, 255, 0.3) transparent",
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: "3px",
      },
      // Add backdrop for mobile
      "&::before": {
        content: '""',
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        zIndex: -1,
        opacity: miniSidenav ? 0 : 1,
        visibility: miniSidenav ? "hidden" : "visible",
        transition: transitions.create(["opacity", "visibility"], {
          easing: transitions.easing.sharp,
          duration: transitions.duration.standard,
        }),
        [breakpoints.up("sm")]: {
          display: "none",
        },
      },
    },
  };
});
