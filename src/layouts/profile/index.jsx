import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import team1 from "../../assets/images/avatar1.png";
import team2 from "../../assets/images/avatar2.png";
import team3 from "../../assets/images/avatar3.png";
import team4 from "../../assets/images/avatar4.png";
// Images
import profile1 from "../../assets/images/profile-1.png";
import profile2 from "../../assets/images/profile-2.png";
import profile3 from "../../assets/images/profile-3.png";
// Vision UI Dashboard React components
import VuiBox from "../../components/VuiBox";
import VuiTypography from "../../components/VuiTypography";
import ProfileInfoCard from "../../examples/Cards/InfoCards/ProfileInfoCard";
import DefaultProjectCard from "../../examples/Cards/ProjectCards/DefaultProjectCard";
import Footer from "../../examples/Footer";
// Vision UI Dashboard React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
// Overview page components
import Header from "../../layouts/profile/components/Header";
import PlatformSettings from "../../layouts/profile/components/PlatformSettings";
import Welcome from "./components/Welcome/index";
import CallUsageStats from "./components/CallUsageStats";

function Overview() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUserData();
  }, []);

  return (
    <DashboardLayout>
      <Header />
      <VuiBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Welcome email={user?.email} role={user?.role} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ProfileInfoCard
              title="profile information"
              description={user?.raw_user_meta_data?.description || "No description provided"}
              info={{
                fullName: user?.raw_user_meta_data?.full_name || "Not set",
                mobile: user?.phone || "Not set",
                email: user?.email || "Not set",
                role: user?.role || "user",
                lastLogin: user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Never"
              }}
              social={[]}
            />
          </Grid>
        </Grid>
      </VuiBox>
      <VuiBox mb={3}>
        <Grid container>
          <Grid size={{ xs: 12 }}>
            <CallUsageStats />
          </Grid>
        </Grid>
      </VuiBox>
      <Grid container spacing={3} mb="30px">
        <Grid size={{ xs: 12, xl: 3 }} sx={{ height: "100%" }}>
          <PlatformSettings />
        </Grid>
        <Grid size={{ xs: 12, xl: 9 }} sx={{ width: "100%" }}>
          <Card>
            <VuiBox display="flex" flexDirection="column" height="100%">
              <VuiBox display="flex" flexDirection="column" mb="24px">
                <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                  Projects
                </VuiTypography>
                <VuiTypography color="text" variant="button" fontWeight="regular">
                  Architects design houses
                </VuiTypography>
              </VuiBox>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6, xl: 4 }} sx={{ width: "100%" }}>
                  <DefaultProjectCard
                    image={profile1}
                    label="project #2"
                    title="modern"
                    description="As Uber works through a huge amount of internal management turmoil."
                    action={{
                      type: "internal",
                      route: "/pages/profile/profile-overview",
                      color: "white",
                      label: "VIEW ALL",
                    }}
                    authors={[
                      { image: team1, name: "Elena Morison" },
                      { image: team2, name: "Ryan Milly" },
                      { image: team3, name: "Nick Daniel" },
                      { image: team4, name: "Peterson" },
                    ]}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, xl: 4 }} sx={{ width: "100%" }}>
                  <DefaultProjectCard
                    image={profile2}
                    label="project #1"
                    title="scandinavian"
                    description="Music is something that every person has his or her own specific opinion about."
                    action={{
                      type: "internal",
                      route: "/pages/profile/profile-overview",
                      color: "white",
                      label: "VIEW ALL",
                    }}
                    authors={[
                      { image: team3, name: "Nick Daniel" },
                      { image: team4, name: "Peterson" },
                      { image: team1, name: "Elena Morison" },
                      { image: team2, name: "Ryan Milly" },
                    ]}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, xl: 4 }} sx={{ width: "100%" }}>
                  <DefaultProjectCard
                    image={profile3}
                    label="project #3"
                    title="minimalist"
                    description="Different people have different taste, and various types of music."
                    action={{
                      type: "internal",
                      route: "/pages/profile/profile-overview",
                      color: "white",
                      label: "VIEW ALL",
                    }}
                    authors={[
                      { image: team4, name: "Peterson" },
                      { image: team3, name: "Nick Daniel" },
                      { image: team2, name: "Ryan Milly" },
                      { image: team1, name: "Elena Morison" },
                    ]}
                  />
                </Grid>
              </Grid>
            </VuiBox>
          </Card>
        </Grid>
      </Grid>

      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
