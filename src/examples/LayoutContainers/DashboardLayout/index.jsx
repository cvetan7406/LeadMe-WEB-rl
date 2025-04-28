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

import { useEffect } from "react";

// react-router-dom components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Vision UI Dashboard React components
import VuiBox from "../../../components/VuiBox";

// Vision UI Dashboard React context
import { useVisionUIController, setLayout } from "../../../context";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  return (
    <VuiBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: "relative",
        
        [breakpoints.up("xs")]: {
          marginLeft: miniSidenav ? pxToRem(80) : "100%",
          width: miniSidenav ? `calc(100% - ${pxToRem(80)})` : "100%",
          transition: transitions.create(["margin-left", "width"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
        
        [breakpoints.up("sm")]: {
          marginLeft: miniSidenav ? pxToRem(96) : pxToRem(250),
          width: miniSidenav ? `calc(100% - ${pxToRem(96)})` : `calc(100% - ${pxToRem(250)})`,
          transition: transitions.create(["margin-left", "width"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
        
        [breakpoints.up("md")]: {
          marginLeft: miniSidenav ? pxToRem(96) : pxToRem(250),
          width: miniSidenav ? `calc(100% - ${pxToRem(96)})` : `calc(100% - ${pxToRem(250)})`,
        },
        
        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(96) : pxToRem(250),
          width: miniSidenav ? `calc(100% - ${pxToRem(96)})` : `calc(100% - ${pxToRem(250)})`,
        },
      })}
    >
      {children}
    </VuiBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
