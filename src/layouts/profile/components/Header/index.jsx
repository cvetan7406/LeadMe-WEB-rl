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

import AppBar from "@mui/material/AppBar";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
// Images
import burceMars from "../../../../assets/images/avatar-simmmple.png";
// Vision UI Dashboard React base styles
import breakpoints from "../../../../assets/theme/base/breakpoints";
import VuiAvatar from "../../../../components/VuiAvatar";
// Vision UI Dashboard React components
import VuiBox from "../../../../components/VuiBox";
import VuiTypography from "../../../../components/VuiTypography";
// Vision UI Dashboard React icons
import { IoCube } from "react-icons/io5";
import { IoDocument } from "react-icons/io5";
import { IoBuild } from "react-icons/io5";
// Vision UI Dashboard React example components
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";

function Header() {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.lg
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  return (
    <VuiBox position="relative">
      <DashboardNavbar light />
      <Card
        sx={{
          px: 3,
          mt: 2,
        }}
      >
        <Grid
          container
          spacing={3}
          alignItems="center"
        >
          <Grid
            item
            xs={12}
            sm={2}
            md={2}
            lg={1}
            sx={({ breakpoints }) => ({
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              [breakpoints.up('sm')]: {
                justifyContent: 'flex-start',
              },
            })}
          >
            <VuiAvatar
              src={burceMars}
              alt="profile-image"
              variant="rounded"
              size="xl"
              shadow="sm"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            md={4}
            lg={3}
          >
            <VuiBox
              height="100%"
              mt={0.5}
              lineHeight={1}
              display="flex"
              flexDirection="column"
              sx={({ breakpoints }) => ({
                justifyContent: 'center',
                alignItems: 'center',
                [breakpoints.up('sm')]: {
                  justifyContent: 'flex-start',
                },
              })}
            >
              <VuiTypography variant="lg" color="white" fontWeight="bold">
                Mark Johnson
              </VuiTypography>
              <VuiTypography variant="button" color="text" fontWeight="regular">
                mark@simmmple.com
              </VuiTypography>
            </VuiBox>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={8}
            sx={{ ml: 'auto' }}
          >
            <AppBar position="static">
              <Tabs
                orientation={tabsOrientation}
                value={tabValue}
                onChange={handleSetTabValue}
                sx={{ background: 'transparent', display: 'flex', justifyContent: 'flex-end' }}
              >
                <Tab label="OVERVIEW" icon={<IoCube color="white" size="16px" />} />
                <Tab label="TEAMS" icon={<IoDocument color="white" size="16px" />} />
                <Tab label="PROJECTS" icon={<IoBuild color="white" size="16px" />} />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Card>
    </VuiBox>
  );
}

export default Header;
