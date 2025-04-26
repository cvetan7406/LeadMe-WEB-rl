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
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import { IconButton } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Vision UI Dashboard React components
import VuiBox from "../../components/VuiBox";

// Custom styles for the SidenavCollapse
import {
  collapseItem,
  collapseIconBox,
  collapseText,
} from "./styles/sidenavCollapse";

// Vision UI Dashboard React context
import { useVisionUIController } from "../../context";

function SidenavCollapse({ color, icon, name, children, active, noCollapse, open, onClick, ...rest }) {
  const [controller] = useVisionUIController();
  const { miniSidenav, transparentSidenav } = controller;

  return (
    <>
      <ListItem 
        component="li" 
        onClick={onClick} 
        sx={{ cursor: 'pointer', padding: 0 }}
      >
        <VuiBox {...rest} sx={(theme) => collapseItem(theme, { active, transparentSidenav, miniSidenav })}>
          <ListItemIcon
            sx={(theme) => collapseIconBox(theme, { active, transparentSidenav, color, miniSidenav })}
          >
            {icon}
          </ListItemIcon>

          {!miniSidenav && (
            <>
              <ListItemText
                primary={name}
                sx={(theme) => collapseText(theme, { miniSidenav, transparentSidenav, active })}
              />
              
              {children && !noCollapse && (
                <IconButton
                  size="small"
                  sx={{
                    p: 0,
                    ml: 'auto',
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: 'inherit'
                  }}
                >
                  <KeyboardArrowDownIcon sx={{ fontSize: '1.25rem' }} />
                </IconButton>
              )}
            </>
          )}
        </VuiBox>
      </ListItem>
      {children && !miniSidenav && (
        <Collapse in={open} unmountOnExit>
          {children}
        </Collapse>
      )}
    </>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  color: "info",
  active: false,
  noCollapse: false,
  children: false,
  open: false,
  onClick: () => {},
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  color: PropTypes.oneOf(["info", "success", "warning", "error", "dark"]),
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  active: PropTypes.bool,
  noCollapse: PropTypes.bool,
  open: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SidenavCollapse;
