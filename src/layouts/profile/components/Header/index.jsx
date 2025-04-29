import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { IoCube, IoDocument, IoBuild } from "react-icons/io5";

import { supabase } from "../../../../config/supabaseClient";
import burceMars from "../../../../assets/images/avatar-simmmple.png";
import breakpoints from "../../../../assets/theme/base/breakpoints";
import VuiAvatar from "../../../../components/VuiAvatar";
import VuiBox from "../../../../components/VuiBox";
import VuiTypography from "../../../../components/VuiTypography";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";

function Header() {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

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
                {user?.raw_user_meta_data?.full_name || 'No Name Set'}
              </VuiTypography>
              <VuiTypography variant="button" color="text" fontWeight="regular">
                {user?.email || 'No Email Set'}
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
