import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import VuiBox from "../../../../components/VuiBox";
import VuiTypography from "../../../../components/VuiTypography";
import { supabase } from '../../../../config/supabaseClient';
import TimelineItem from "../../../../examples/Timeline/TimelineItem";
import { TimelineProvider } from "../../../../examples/Timeline/context";
import palette from "../../../../assets/theme/base/colors";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness3Icon from '@mui/icons-material/Brightness3';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import Button from '@mui/material/Button';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function OrdersOverview() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching campaigns:', error);
      } else {
        console.log('Fetched data:', data);
        setCampaigns(data);
      }
    };

    fetchCampaigns();
  }, []);

  // Function to select an icon based on the scheduled time
  const getIconForTime = (scheduledTime) => {
    const hour = new Date(scheduledTime).getHours();
    if (hour >= 6 && hour < 18) {
      return <WbSunnyIcon style={{ color: palette.warning.main }} />; // Daytime
    } else if (hour >= 18 && hour < 22) {
      return <Brightness3Icon style={{ color: palette.info.main }} />; // Evening
    } else {
      return <NightsStayIcon style={{ color: palette.primary.main }} />; // Nighttime
    }
  };

  const handleDisable = (campaignId) => {
    console.log(`Disable campaign with ID: ${campaignId}`);
  };

  
  const handleEdit = (campaignId) => {
    console.log(`Edit campaign with ID: ${campaignId}`);
  
  };

  const handleDelete = (campaignId) => {
    console.log(`Delete campaign with ID: ${campaignId}`);
  };

  return (
    <Card className="h-100">
      <VuiBox mb="16px">
        <VuiTypography variant="lg" fontWeight="bold" mb="5px" color="white">
          Campaigns Overview
        </VuiTypography>
        <VuiBox mb={2}>
          <VuiBox display="flex" alignItems="center">
            <VuiTypography variant="button" color="text" fontWeight="medium" ml="5px" mr="2px">
              Recent Campaigns
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </VuiBox>
      <TimelineProvider value={true}>
        <VuiBox
          sx={{
            maxHeight: '400px',
            overflowY: 'auto',
            scrollBehavior: 'smooth',
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.3)",
              },
            },
          }}
        >
          {campaigns.map((campaign) => (
            <VuiBox key={campaign.id} mb={2}>
              <TimelineItem
                
                title={campaign.name}
                dateTime={`Scheduled at: ${new Date(campaign.start_time).toLocaleString()}`}
                description={campaign.description}
                status={campaign.status}
              />
              <VuiBox display="flex" justifyContent="flex-start" mt={1}>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => handleDisable(campaign.id)}
                  style={{ marginRight: '8px' }}
                >
                  <BlockIcon />
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEdit(campaign.id)}
                  style={{ marginRight: '8px' }}
                >
                  <EditIcon />
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(campaign.id)}
                >
                  <DeleteIcon />
                </Button>
              </VuiBox>
            </VuiBox>
          ))}
        </VuiBox>
      </TimelineProvider>
    </Card>
  );
}

export default OrdersOverview;