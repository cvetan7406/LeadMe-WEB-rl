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

import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuItem from "@mui/material/MenuItem";

// Vision UI Dashboard React components
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import VuiInput from "../../../components/VuiInput";

// Vision UI Dashboard React example components
import Breadcrumbs from "../../../examples/Breadcrumbs";
import NotificationItem from "../../../examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "../../../examples/Navbars/DashboardNavbar/styles";

// Vision UI Dashboard React context
import {
  useVisionUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "../../../context";

// Auth context
import { useAuth } from "../../../context/AuthContext";
import { useNotifications } from "../../../context/NotificationContext";

// Images
import team2 from "../../../assets/images/team-2.jpg";
import logoSpotify from "../../../assets/images/small-logos/logo-spotify.svg";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(null);
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const { notifications, removeNotification } = useNotifications();

  useEffect(() => {
    setNavbarType("sticky");

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, window.scrollY === 0);
    }

    /**
     The event listener that's calling the handleTransparentNavbar function when
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch]);

  // For desktop: Handle mini sidenav toggle
  // For mobile: Use the global drawer toggle function
  const handleSidenavToggle = () => {
    if (isMobile) {
      // Use the globally exposed drawer toggle function for mobile
      if (window.toggleSidenav) {
        window.toggleSidenav();
      }
    } else {
      // Use the regular miniSidenav toggle for desktop
      setMiniSidenav(dispatch, !miniSidenav);
    }
  };
  
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(null);
  
  // Handle sign out
  const handleSignOutClick = async () => {
    try {
      // Use the AuthContext's signOut function correctly with async/await
      const { error } = await signOut();
      
      if (error) {
        console.error('Failed to sign out:', error);
        throw error;
      }
      
      // Navigate to sign-in page
      navigate('/authentication/sign-in');
    } catch (error) {
      console.error('Failed to sign out:', error);
      // Force navigation to sign-in page even if there's an error
      navigate('/authentication/sign-in');
    }
  };

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      {notifications.length === 0 ? (
        <MenuItem onClick={handleCloseMenu}>
          <VuiTypography variant="button" color="text">
            No new notifications
          </VuiTypography>
        </MenuItem>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            image={notification.image}
            title={notification.title}
            date={notification.timestamp.toLocaleString()}
            onClick={() => {
              removeNotification(notification.id);
              handleCloseMenu();
            }}
          />
        ))
      )}
    </Menu>
  );

  return (
    <AppBar
      position="sticky"
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, miniSidenav })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        {/* Left content */}
        <VuiBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini, isRight: false })}>
          <Breadcrumbs title={route[route.length - 1]} route={route} light={light} />
          
          {/* Mobile menu button only on mobile */}
          {isMobile && (
            <IconButton
              size="small"
              color="inherit"
              sx={{
                color: "white.main",
                display: { xs: "inline-flex", md: "none" }
              }}
              onClick={handleSidenavToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </VuiBox>

        {/* Right content */}
        {isMini ? null : (
          <VuiBox sx={(theme) => navbarRow(theme, { isMini, isRight: true })}>
            <VuiBox pr={1}>
              <VuiInput
                placeholder="Type here..."
                icon={{ 
                  component: <SearchIcon sx={{ color: 'white.main' }} />,
                  direction: "left" 
                }}
                sx={({ breakpoints, palette }) => ({
                  [breakpoints.down("sm")]: {
                    maxWidth: "80px",
                  },
                  [breakpoints.only("sm")]: {
                    maxWidth: "80px",
                  },
                  backgroundColor: "info.main !important",
                  "& .MuiInputBase-input": {
                    color: palette.white.main,
                  },
                  "& .MuiInputAdornment-root": {
                    color: palette.white.main,
                  },
                  "& .MuiSvgIcon-root": {
                    color: `${palette.white.main} !important`,
                  }
                })}
              />
            </VuiBox>
            <VuiBox color={light ? "white" : "inherit"}>
              <IconButton 
                sx={navbarIconButton} 
                size="large"
                onClick={handleSignOutClick}
              >
                <LogoutIcon sx={({ palette: { dark, white } }) => ({
                  color: light ? white.main : dark.main,
                })} />
                <VuiTypography
                  variant="button"
                  fontWeight="medium"
                  color={light ? "white" : "dark"}
                >
                  Sign out
                </VuiTypography>
              </IconButton>
              
              {/* Desktop menu button - only visible on desktop */}
              {!isMobile && (
                <IconButton
                  size="small"
                  color="inherit"
                  sx={{
                    ...navbarMobileMenu,
                    display: { xs: "none", md: "inline-flex" }
                  }}
                  onClick={handleSidenavToggle}
                >
                  <MenuIcon sx={{ color: "white.main" }} />
                </IconButton>
              )}
              
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <SettingsIcon sx={({ palette: { white } }) => ({
                  color: white.main,
                  fontSize: "1.25rem"
                })} />
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <NotificationsIcon sx={({ palette: { dark, white } }) => ({
                  color: light ? white.main : dark.main,
                })} />
                {notifications.length > 0 && (
                  <VuiBox
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: 'error.main',
                      borderRadius: '50%',
                      width: '8px',
                      height: '8px',
                    }}
                  />
                )}
              </IconButton>
              {renderMenu()}
            </VuiBox>
          </VuiBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
