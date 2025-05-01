import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import VuiBadge from "../../../components/VuiBadge";
import { supabase } from "../../../config/supabaseClient";

function Campaign({ name, description }) {
  return (
    <VuiBox display="flex" flexDirection="column">
      <VuiTypography variant="button" color="white" fontWeight="medium">
        {name}
      </VuiTypography>
      <VuiTypography variant="caption" color="text">
        {description}
      </VuiTypography>
    </VuiBox>
  );
}

function Stats({ metrics }) {
  const totalCalls = metrics?.total_calls || 0;
  const successRate = metrics?.success_rate || 0;
  
  return (
    <VuiBox display="flex" flexDirection="column">
      <VuiTypography variant="caption" fontWeight="medium" color="white">
        {totalCalls} Calls
      </VuiTypography>
      <VuiTypography variant="caption" color="text">
        {successRate}% Success
      </VuiTypography>
    </VuiBox>
  );
}

const useCampaignsData = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  const handleEdit = (campaignId) => {
    navigate(`/campaigns/edit/${campaignId}`);
  };

  const handleDelete = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      // Add your delete logic here
      console.log('Delete campaign:', campaignId);
    }
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'completed')
        .order('end_time', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error);
        return;
      }

      const formattedData = data.map(campaign => ({
        id: campaign.id,
        campaign: <Campaign name={campaign.name} description={campaign.description} />,
        stats: <Stats metrics={campaign.metrics} />,
        status: (
          <VuiBadge
            variant="standard"
            badgeContent="Completed"
            color="success"
            size="xs"
            container
            sx={({ palette: { white, success }, borders: { borderRadius, borderWidth } }) => ({
              background: success.main,
              border: `${borderWidth[1]} solid ${success.main}`,
              borderRadius: borderRadius.md,
              color: white.main,
            })}
          />
        ),
        completed: (
          <VuiTypography variant="caption" color="white" fontWeight="medium">
            {new Date(campaign.end_time).toLocaleDateString()}
          </VuiTypography>
        ),
        action: (
          <VuiBox display="flex" gap={2} justifyContent="center">
            <VuiTypography
              component="button"
              variant="caption"
              color="info"
              fontWeight="medium"
              onClick={() => handleEdit(campaign.id)}
              sx={{
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0
              }}
            >
              Edit
            </VuiTypography>
            <VuiTypography
              component="button"
              variant="caption"
              color="error"
              fontWeight="medium"
              onClick={() => handleDelete(campaign.id)}
              sx={{
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0
              }}
            >
              Delete
            </VuiTypography>
          </VuiBox>
        ),
      }));

      setCampaigns(formattedData);
    };

    fetchCampaigns();
  }, []);

  return {
    columns: [
      { name: "campaign", align: "left", label: "Campaign" },
      { name: "stats", align: "left", label: "Statistics" },
      { name: "status", align: "center", label: "Status" },
      { name: "completed", align: "center", label: "Completed Date" },
      { name: "action", align: "center", label: "Actions" },
    ],
    rows: campaigns
  };
};

export default useCampaignsData;