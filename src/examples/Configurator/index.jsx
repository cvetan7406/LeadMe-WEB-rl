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
import { supabase } from "../../config/supabaseClient";

// @mui material components
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CloseIcon from "@mui/icons-material/Close";

// Vision UI Dashboard React components
import VuiBox from "../../components/VuiBox";
import VuiTypography from "../../components/VuiTypography";
import VuiButton from "../../components/VuiButton";
import VuiSwitch from "../../components/VuiSwitch";

// Custom styles for the Configurator
import ConfiguratorRoot from "../../examples/Configurator/ConfiguratorRoot";

// Vision UI Dashboard React context
import {
  useVisionUIController,
  setOpenConfigurator,
  setTransparentSidenav,
  setFixedNavbar,
  setSidenavColor,
} from "../../context";

import { useFilters } from "../../context/FilterContext";

function Configurator() {
  const [controller, dispatch] = useVisionUIController();
  const { openConfigurator, transparentSidenav, fixedNavbar, sidenavColor } = controller;
  const [disabled, setDisabled] = useState(false);
  const { filters, updateFilters } = useFilters();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const sidenavColors = ["primary", "info", "success", "warning", "error"];

  // Fetch campaigns from Supabase
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')  // replace with your actual campaigns table name
        .select('id, name')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Use the useEffect hook to change the button state for the sidenav type based on window size.
  useEffect(() => {
    // A function that sets the disabled state of the buttons for the sidenav type.
    function handleDisabled() {
      return window.innerWidth > 1200 ? setDisabled(false) : setDisabled(true);
    }

    // The event listener that's calling the handleDisabled function when resizing the window.
    window.addEventListener("resize", handleDisabled);

    // Call the handleDisabled function to set the state with the initial value.
    handleDisabled();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleDisabled);
  }, []);

  // Set default filters only once when component mounts
  useEffect(() => {
    // Only set default filters if they're not already set
    if (!filters.selectedCampaign) {
      // Default to no specific campaign selected
      updateFilters({
        selectedCampaign: '',
      });
    }
  }, []); // Empty dependency array to run only once on mount

  const handleCloseConfigurator = () => setOpenConfigurator(dispatch, false);
  const handleTransparentSidenav = () => setTransparentSidenav(dispatch, true);
  const handleWhiteSidenav = () => setTransparentSidenav(dispatch, false);
  const handleFixedNavbar = () => setFixedNavbar(dispatch, !fixedNavbar);

  const handleFilterChange = () => {
    const selectedCampaign = document.getElementById('campaignSelect').value;

    // Create a new filter object based on selection
    const newFilters = {
      selectedCampaign,
    };

    // Only update if filter has actually changed
    if (newFilters.selectedCampaign !== filters.selectedCampaign) {
      updateFilters(newFilters);
    }
    
    handleCloseConfigurator();
  };

  // sidenav type buttons styles
  const sidenavTypeButtonsStyles = ({
    functions: { pxToRem },
    boxShadows: { buttonBoxShadow },
  }) => ({
    height: pxToRem(42),
    boxShadow: buttonBoxShadow.main,

    "&:hover, &:focus": {
      opacity: 1,
    },
  });

  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator }}>
      <VuiBox
        backgroundColor="black"
        display="flex"
        justifyContent="space-between"
        alignItems="baseline"
        pt={3}
        pb={0.8}
        px={3}
      >
        <VuiBox>
          <VuiTypography color="white" variant="h5" fontWeight="bold">
            Campaign Selector
          </VuiTypography>
          <VuiTypography variant="body2" color="white" fontWeight="bold">
            Select campaign to view data
          </VuiTypography>
        </VuiBox>

        <CloseIcon
          sx={({ typography: { size, fontWeightBold }, palette: { white, dark } }) => ({
            fontSize: `${size.md} !important`,
            fontWeight: `${fontWeightBold} !important`,
            stroke: `${white.main} !important`,
            strokeWidth: "2px",
            cursor: "pointer",
            mt: 2,
          })}
          onClick={handleCloseConfigurator}
        />
      </VuiBox>

      <Divider />

      <VuiBox pt={1.25} pb={3} px={3}>
        <VuiBox mb={3}>
          <VuiTypography variant="h6" color="white">
            Select Campaign
          </VuiTypography>
          
          <VuiBox mt={2} display="flex" flexDirection="column" gap={2}>
            <VuiBox>
              <VuiTypography variant="button" color="text" fontWeight="regular" mb={1} display="block">
                Choose a campaign to view its data
              </VuiTypography>
              <VuiBox
                component="select"
                id="campaignSelect"
                value={filters.selectedCampaign}
                onChange={(e) => {
                  // Only update if the value has actually changed
                  if (e.target.value !== filters.selectedCampaign) {
                    updateFilters({ selectedCampaign: e.target.value });
                  }
                }}
                disabled={loading}
                sx={{
                  width: '100%',
                  minWidth: '160px',
                  height: '42px',
                  display: 'flex',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  lineHeight: '1.4',
                  color: 'white.main',
                  backgroundColor: 'transparent',
                  border: ({ borders: { borderWidth }, palette: { white } }) =>
                    `${borderWidth[1]} solid ${white.main}`,
                  borderRadius: 'xl',
                  cursor: 'pointer',
                  transition: 'all 200ms linear',
                  '&:hover': {
                    opacity: 0.75
                  },
                  '&:focus': {
                    outline: 'none'
                  },
                  '& option': {
                    color: 'dark.main',
                    backgroundColor: 'white.main'
                  }
                }}
              >
                <option value="">All Campaigns</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </VuiBox>
              {loading && (
                <VuiTypography variant="caption" color="text" fontWeight="regular" mt={1}>
                  Loading campaigns...
                </VuiTypography>
              )}
            </VuiBox>
          </VuiBox>
        </VuiBox>

        <VuiBox>
          <VuiButton
            color="info"
            variant="contained"
            fullWidth
            onClick={handleFilterChange}
          >
            Apply Filters
          </VuiButton>
        </VuiBox>
      </VuiBox>

      <Divider />

      <VuiBox>
      {/* <VuiBox pt={1.25} pb={3} px={3}>
        <VuiBox>
          <VuiTypography variant="h6" color="white">
            Sidenav Colors
          </VuiTypography>

          <VuiBox mb={0.5}>
            {sidenavColors.map((color) => (
              <IconButton
                key={color}
                sx={({ borders: { borderWidth }, palette: { white, dark }, transitions }) => ({
                  width: "24px",
                  height: "24px",
                  padding: 0,
                  border: `${borderWidth[1]} solid ${white.main}`,
                  borderColor: sidenavColor === color && dark.main,
                  transition: transitions.create("border-color", {
                    easing: transitions.easing.sharp,
                    duration: transitions.duration.shorter,
                  }),
                  backgroundImage: ({ functions: { linearGradient }, palette: { gradients } }) =>
                    linearGradient(gradients[color].main, gradients[color].state),

                  "&:not(:last-child)": {
                    mr: 1,
                  },

                  "&:hover, &:focus, &:active": {
                    borderColor: dark.main,
                  },
                })}
                onClick={() => setSidenavColor(dispatch, color)}
              />
            ))}
          </VuiBox>
        </VuiBox>
        {window.innerWidth >= 1440 && (
          <VuiBox mt={3} lineHeight={1}>
            <VuiTypography variant="h6" color="white">
              Sidenav Type
            </VuiTypography>
            <VuiTypography variant="button" color="text" fontWeight="regular">
              Choose 
            </VuiTypography>

            <VuiBox
              sx={{
                display: "flex",
                mt: 2,
              }}
            >
              <VuiButton
                color="info"
                variant={transparentSidenav ? "contained" : "outlined"}
                onClick={handleTransparentSidenav}
                disabled={disabled}
                fullWidth
                sx={{
                  mr: 1,
                  ...sidenavTypeButtonsStyles,
                }}
              >
                Transparent
              </VuiButton>
              <VuiButton
                color="info"
                variant={transparentSidenav ? "outlined" : "contained"}
                onClick={handleWhiteSidenav}
                disabled={disabled}
                fullWidth
                sx={sidenavTypeButtonsStyles}
              >
                Opaque
              </VuiButton>
            </VuiBox>
          </VuiBox>
        )}

        <VuiBox mt={3} mb={2} lineHeight={1}>
          <VuiTypography variant="h6" color="white">
            Navbar Fixed
          </VuiTypography>

          <VuiSwitch checked={fixedNavbar} onChange={handleFixedNavbar} color="info" />
        </VuiBox> */}

        <Divider />

        <VuiBox mt={3} mb={2}>
          <VuiButton
            component={Link}
            href="https://docs.csoc.bg/"
            target="_blank"
            rel="noreferrer"
            color="info"
            variant="contained"
            fullWidth
          >
            Documentation
          </VuiButton>
        </VuiBox>
      </VuiBox>
    </ConfiguratorRoot>
  );
}

export default Configurator;
