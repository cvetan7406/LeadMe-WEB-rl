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
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Card, LinearProgress, Stack } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "../../components/VuiBox";
import VuiTypography from "../../components/VuiTypography";
import VuiProgress from "../../components/VuiProgress";

// Vision UI Dashboard React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import MiniStatisticsCard from "../../examples/Cards/StatisticsCards/MiniStatisticsCard";
import linearGradient from "../../assets/theme/functions/linearGradient";

// Vision UI Dashboard React base styles
import colors from "../../assets/theme/base/colors";

// Dashboard layout components
import WelcomeMark from "../../layouts/dashboard/components/WelcomeMark";
import Projects from "../../layouts/dashboard/components/Projects";
import OrderOverview from "./components/CampaignOverview/index.jsx";
import SatisfactionRate from "../../layouts/dashboard/components/SatisfactionRate";
import ReferralTracking from "../../layouts/dashboard/components/ReferralTracking";

// Import our new components
import CampaignStats from "../../layouts/tables/components/CampaignStats";
import CallRecordings from "../../layouts/tables/components/CallRecordings";
import UploadedLeads from "../../layouts/tables/components/UploadedLeads";
import FileStorage from "../../layouts/tables/components/FileStorage";
import AudioFiles from "../../layouts/tables/components/AudioFiles";

// Data
import LineChart from "../../examples/Charts/LineCharts/LineChart.jsx";
import BarChart from "../../examples/Charts/BarCharts/BarChart.jsx";
import { barChartDataDashboard } from "../../layouts/dashboard/data/barChartData";
import { barChartOptionsDashboard } from "../../layouts/dashboard/data/barChartOptions";
import { lineChartDataDashboard } from "../../layouts/dashboard/data/lineChartData";
import { lineChartOptionsDashboard } from "../../layouts/dashboard/data/lineChartOptions";

// React icons
import { IoIosRocket } from "react-icons/io";
import { IoGlobe } from "react-icons/io5";
import { IoBuild } from "react-icons/io5";
import { IoWallet } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

import React, { useState, useEffect } from 'react';
import { useFilters } from '../../context/FilterContext';
import { supabase } from '../../config/supabaseClient';
import axios from 'axios';

function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;
  const { filters } = useFilters();
  const [leadCount, setLeadCount] = useState(0);
  const [activeComponent, setActiveComponent] = useState('campaign-stats');
  const [dashboardStats, setDashboardStats] = useState({
    calls_success_display: "0 / 0",
    success_rate: 0,
    avg_call_duration: 0,
    calls_cancelled_display: "0 / 0",
    cancelled_rate: 0,
    today_users: 0,
    user_percent_change: 0,
    new_clients: 0,
    new_clients_percent: 0
  });
  const [loading, setLoading] = useState(true);

  // State to hold the current time
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Effect to update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Effect to fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const apiKey = import.meta.env.VITE_AUTO_DIALER_AUTH_TOKEN;
        if (!apiKey) {
          throw new Error('API key not found in environment variables');
        }
        
        const response = await axios.get('/api/dashboard/stats', {
          headers: {
            'X-API-Key': apiKey
          }
        });
        
        if (response.data) {
          setDashboardStats(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const fetchLeadCount = async () => {
      console.log('Fetching lead count with filters:', filters);
      const startDate = new Date(filters.startDate || '1970-01-01');
      const endDate = new Date(filters.endDate || new Date().toISOString());

      if (isNaN(startDate) || isNaN(endDate)) {
        console.error('Invalid date range');
        return;
      }

      const { data, error, count } = await supabase
        .from('uploaded_leads')
        .select('id', { count: 'exact' })
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) {
        console.error('Error fetching lead count:', error);
      } else {
        console.log('Lead count:', count);
        setLeadCount(count || 0);
      }
    };

    fetchLeadCount();
  }, [filters]);

  // Function to get the active component title
  const getActiveComponentTitle = () => {
    switch (activeComponent) {
      case 'campaign-stats':
        return "Campaign Statistics";
      case 'call-recordings':
        return "Call Recordings";
      case 'uploaded-leads':
        return "Uploaded Leads";
      case 'file-storage':
        return "File Storage";
      case 'audio-files':
        return "Audio Files";
      default:
        return "Campaign Statistics";
    }
  };

  // Function to render the active component
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'campaign-stats':
        return (
          <React.Suspense fallback={<VuiBox p={3}>Loading campaign statistics...</VuiBox>}>
            <CampaignStats />
          </React.Suspense>
        );
      case 'call-recordings':
        return (
          <React.Suspense fallback={<VuiBox p={3}>Loading call recordings...</VuiBox>}>
            <CallRecordings />
          </React.Suspense>
        );
      case 'uploaded-leads':
        return (
          <React.Suspense fallback={<VuiBox p={3}>Loading uploaded leads...</VuiBox>}>
            <UploadedLeads />
          </React.Suspense>
        );
      case 'file-storage':
        return (
          <React.Suspense fallback={<VuiBox p={3}>Loading file storage data...</VuiBox>}>
            <FileStorage />
          </React.Suspense>
        );
      case 'audio-files':
        return (
          <React.Suspense fallback={<VuiBox p={3}>Loading audio files data...</VuiBox>}>
            <AudioFiles />
          </React.Suspense>
        );
      default:
        return (
          <React.Suspense fallback={<VuiBox p={3}>Loading campaign statistics...</VuiBox>}>
            <CampaignStats />
          </React.Suspense>
        );
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox
        py={3}
        px={2}
        width="100%"
        sx={{
          maxWidth: "100%",
          margin: "0 auto",
          position: "relative",
          "& > *": {
            position: "relative",
            zIndex: 1
          }
        }}
      >
        <VuiBox mb={3}>
          <WelcomeMark />
        </VuiBox>
        <VuiBox mb={3}>
          <Grid
            container
            spacing={1}
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Grid item xs={12} sm={6} md={true} sx={{ flex: 1 }}>
              <MiniStatisticsCard
                title={{ text: "Calls Success Rate", fontWeight: "regular" }}
                count={dashboardStats.calls_success_display}
                percentage={{ color: "success", text: ` ${dashboardStats.success_rate}%` }}
                icon={{ color: "info", component: <IoWallet size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={true} sx={{ flex: 1 }}>
              <MiniStatisticsCard
                title={{ text: "Avg. Call Duration", fontWeight: "regular" }}
                count={`${dashboardStats.avg_call_duration} sec`}
                percentage={{ color: "success", text: "" }}
                icon={{ color: "info", component: <IoGlobe size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={true} sx={{ flex: 1 }}>
              <MiniStatisticsCard
                title={{ text: "Leads Count", fontWeight: "regular" }}
                count={leadCount}
                percentage={{ color: "success", text: "" }}
                icon={{ color: "info", component: <IoDocumentText size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={true} sx={{ flex: 1 }}>
              <MiniStatisticsCard
                title={{ text: "Current Time", fontWeight: "bold" }}
                count={currentTime}
                percentage={{ color: "info", text: "" }}
                icon={{ color: "info", component: <FaShoppingCart size="20px" color="white" /> }}
                countStyle={{ fontSize: "2rem" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={true} sx={{ flex: 1 }}>
              <MiniStatisticsCard
                title={{ text: "Cancelled Calls", fontWeight: "regular" }}
                count={dashboardStats.calls_cancelled_display}
                percentage={{ color: "error", text: ` ${dashboardStats.cancelled_rate}%` }}
                icon={{ color: "info", component: <IoWallet size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={true} sx={{ flex: 1 }}>
              <MiniStatisticsCard
                title={{ text: "Today's Users", fontWeight: "regular" }}
                count={dashboardStats.today_users}
                percentage={{
                  color: dashboardStats.user_percent_change >= 0 ? "success" : "error",
                  text: `${dashboardStats.user_percent_change >= 0 ? '+' : ''}${dashboardStats.user_percent_change}%`
                }}
                icon={{ color: "info", component: <IoGlobe size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={true} sx={{ flex: 1 }}>
              <MiniStatisticsCard
                title={{ text: "New Clients", fontWeight: "regular" }}
                count={dashboardStats.new_clients}
                percentage={{ color: "success", text: `+${dashboardStats.new_clients_percent}%` }}
                icon={{ color: "info", component: <IoDocumentText size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={true} sx={{ flex: 1 }}>
              <MiniStatisticsCard
                title={{ text: "Current Date", fontWeight: "bold" }}
                count={new Date().toLocaleDateString()}
                percentage={{ color: "info", text: "" }}
                icon={{ color: "info", component: <IoIosRocket size="20px" color="white" /> }}
                countStyle={{ fontSize: "2rem" }}
              />
            </Grid>
          </Grid>
        </VuiBox>
        
        {/* Component Navigation */}
        <VuiBox mb={3} width="100%">
          <Card sx={{ width: "100%" }}>
            <VuiBox
              p={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              width="100%"
              sx={{
                "& > button": {
                  flex: "1 1 0",
                  display: "flex",
                  justifyContent: "center"
                }
              }}
            >
              <VuiBox
                component="button"
                onClick={() => setActiveComponent("campaign-stats")}
                bgcolor={activeComponent === "campaign-stats" ? "primary.main" : "transparent"}
                color="white"
                borderRadius="lg"
                px={2}
                py={1.5}
                mx={1}
                mb={1}
                sx={{ border: 'none', cursor: 'pointer' }}
              >
                <VuiTypography variant="button" color="white" fontWeight="medium">
                  Campaign Stats
                </VuiTypography>
              </VuiBox>
              
              <VuiBox
                component="button"
                onClick={() => setActiveComponent("call-recordings")}
                bgcolor={activeComponent === "call-recordings" ? "primary.main" : "transparent"}
                color="white"
                borderRadius="lg"
                px={2}
                py={1.5}
                mx={1}
                mb={1}
                sx={{ border: 'none', cursor: 'pointer' }}
              >
                <VuiTypography variant="button" color="white" fontWeight="medium">
                  Call Recordings
                </VuiTypography>
              </VuiBox>
              
              <VuiBox
                component="button"
                onClick={() => setActiveComponent("uploaded-leads")}
                bgcolor={activeComponent === "uploaded-leads" ? "primary.main" : "transparent"}
                color="white"
                borderRadius="lg"
                px={2}
                py={1.5}
                mx={1}
                mb={1}
                sx={{ border: 'none', cursor: 'pointer' }}
              >
                <VuiTypography variant="button" color="white" fontWeight="medium">
                  Uploaded Leads
                </VuiTypography>
              </VuiBox>
              
              <VuiBox
                component="button"
                onClick={() => setActiveComponent("file-storage")}
                bgcolor={activeComponent === "file-storage" ? "primary.main" : "transparent"}
                color="white"
                borderRadius="lg"
                px={2}
                py={1.5}
                mx={1}
                mb={1}
                sx={{ border: 'none', cursor: 'pointer' }}
              >
                <VuiTypography variant="button" color="white" fontWeight="medium">
                  File Storage
                </VuiTypography>
              </VuiBox>
              
              <VuiBox
                component="button"
                onClick={() => setActiveComponent("audio-files")}
                bgcolor={activeComponent === "audio-files" ? "primary.main" : "transparent"}
                color="white"
                borderRadius="lg"
                px={2}
                py={1.5}
                mx={1}
                mb={1}
                sx={{ border: 'none', cursor: 'pointer' }}
              >
                <VuiTypography variant="button" color="white" fontWeight="medium">
                  Audio Files
                </VuiTypography>
              </VuiBox>
            </VuiBox>
          </Card>
        </VuiBox>

        {/* Render the active component */}
        <VuiBox mb={3} width="100%">
          <Card sx={{ width: "100%" }}>
            <VuiBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              borderBottom="1px solid rgba(255, 255, 255, 0.1)"
            >
              <VuiTypography variant="h6" color="white" fontWeight="medium">
                {getActiveComponentTitle()}
              </VuiTypography>
            </VuiBox>
            <VuiBox p={3} width="100%">
              {renderActiveComponent()}
            </VuiBox>
          </Card>
        </VuiBox>
        
        <Footer />
      </VuiBox>
    </DashboardLayout>
  );
}

export default Dashboard;
