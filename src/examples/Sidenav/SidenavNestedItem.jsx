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

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

// Vision UI Dashboard React components
import VuiBox from "../../components/VuiBox";

// Custom styles for the SidenavNestedItem
import { nestedItem } from "./styles/sidenavCollapse";

// Vision UI Dashboard React context
import { useVisionUIController } from "../../context";

function SidenavNestedItem({ color, name, active, ...rest }) {
  const [controller] = useVisionUIController();
  const { miniSidenav, transparentSidenav } = controller;

  return (
    <ListItem component="li" sx={{ padding: 0 }}>
      <VuiBox
        {...rest}
        sx={(theme) => nestedItem(theme, { active, transparentSidenav, miniSidenav })}
      >
        <ListItemText
          primary={name}
          sx={{
            ml: 0.5,
            mr: 0.5,
            "& .MuiListItemText-primary": {
              fontSize: "0.875rem",
              fontWeight: active ? 600 : 400,
              color: "#fff",
            },
          }}
        />
      </VuiBox>
    </ListItem>
  );
}

// Setting default values for the props of SidenavNestedItem
SidenavNestedItem.defaultProps = {
  color: "info",
  active: false,
};

// Typechecking props for the SidenavNestedItem
SidenavNestedItem.propTypes = {
  color: PropTypes.oneOf(["info", "success", "warning", "error", "dark"]),
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

export default SidenavNestedItem; 