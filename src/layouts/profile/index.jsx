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
import CarInformations from "./components/CarInformations";

function Overview() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    ssoUsers: 0,
    emailConfirmed: 0,
    newUsersThisWeek: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    const fetchStats = async () => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get total users count
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact' });

      // Get active users (not deleted or banned)
      const { count: activeUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .is('deleted_at', null)
        .is('banned_until', null);

      // Get SSO users count
      const { count: ssoUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .eq('is_sso_user', true);

      // Get email confirmed users
      const { count: emailConfirmed } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .not('email_confirmed_at', 'is', null);

      // Get new users this week
      const { count: newUsersThisWeek } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .gte('created_at', weekAgo.toISOString());

      setStats({
        totalUsers,
        activeUsers,
        ssoUsers,
        emailConfirmed,
        newUsersThisWeek
      });
    };

    fetchUserData();
    fetchStats();
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
            <CarInformations />
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
