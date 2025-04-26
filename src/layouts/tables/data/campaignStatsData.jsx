import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabaseClient';
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import VuiBadge from "../../../components/VuiBadge";
import VuiProgress from "../../../components/VuiProgress";
import PhoneIcon from '@mui/icons-material/Phone';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

// Status badge component
function StatusBadge({ status }) {
  let color = "info";
  
  if (status === "completed") color = "success";
  else if (status === "running") color = "info";
  else if (status === "paused") color = "warning";
  else if (status === "draft") color = "secondary";
  else if (status === "scheduled") color = "primary";
  
  return (
    <VuiBadge
      variant="standard"
      badgeContent={status.charAt(0).toUpperCase() + status.slice(1)}
      color={color}
      size="xs"
      container
      sx={({ palette: { white, [color]: mainColor }, borders: { borderRadius, borderWidth } }) => ({
        background: color === "secondary" ? "unset" : mainColor.main,
        border: `${borderWidth[1]} solid ${color === "secondary" ? white.main : mainColor.main}`,
        borderRadius: borderRadius.md,
        color: white.main,
      })}
    />
  );
}

// Completion component
function Completion({ value, color }) {
  return (
    <VuiBox display="flex" flexDirection="column" alignItems="flex-start">
      <VuiTypography variant="button" color="white" fontWeight="medium" mb="4px">
        {value}%&nbsp;
      </VuiTypography>
      <VuiBox width="8rem">
        <VuiProgress value={value} color={color} sx={{ background: "#2D2E5F" }} label={false} />
      </VuiBox>
    </VuiBox>
  );
}

// Hook to fetch campaign statistics
export const useCampaignStats = () => {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    statusCounts: {
      draft: 0,
      scheduled: 0,
      running: 0,
      paused: 0,
      completed: 0
    },
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    totalRecordings: 0,
    recentCampaigns: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch campaign counts by status
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select('id, name, status, start_time, end_time, created_at, updated_at, metrics');
        
        if (campaignError) throw campaignError;
        
        // Calculate status counts
        const statusCounts = {
          draft: 0,
          scheduled: 0,
          running: 0,
          paused: 0,
          completed: 0
        };
        
        campaignData.forEach(campaign => {
          if (statusCounts[campaign.status] !== undefined) {
            statusCounts[campaign.status]++;
          }
        });
        
        // Fetch call data
        const { data: callData, error: callError } = await supabase
          .from('twilio_calls')
          .select('status');
        
        if (callError) throw callError;
        
        // Count successful and failed calls
        const successfulCalls = callData.filter(call => call.status === 'completed').length;
        const failedCalls = callData.filter(call => ['failed', 'busy', 'no-answer', 'canceled'].includes(call.status)).length;
        
        // Fetch recording count
        const { count: recordingsCount, error: recordingError } = await supabase
          .from('twilio_call_recordings')
          .select('recording_sid', { count: 'exact', head: true });
        
        if (recordingError) throw recordingError;
        
        // Get recent campaigns (last 5)
        const recentCampaigns = campaignData
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
          .map(campaign => ({
            id: campaign.id,
            name: campaign.name,
            status: campaign.status,
            created_at: new Date(campaign.created_at).toLocaleDateString(),
            completion: calculateCompletion(campaign)
          }));
        
        setStats({
          totalCampaigns: campaignData.length,
          statusCounts,
          totalCalls: callData.length,
          successfulCalls,
          failedCalls,
          totalRecordings: recordingsCount || 0,
          recentCampaigns
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching campaign stats:', error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return { stats, loading };
};

// Helper function to calculate campaign completion percentage
const calculateCompletion = (campaign) => {
  if (campaign.status === 'completed') return 100;
  if (campaign.status === 'draft') return 0;
  
  // If metrics exist, use them to calculate completion
  if (campaign.metrics && campaign.metrics.total && campaign.metrics.completed) {
    return Math.round((campaign.metrics.completed / campaign.metrics.total) * 100);
  }
  
  // Otherwise estimate based on status
  if (campaign.status === 'scheduled') return 25;
  if (campaign.status === 'running') return 50;
  if (campaign.status === 'paused') return 75;
  
  return 0;
};

export const campaignStatsColumns = [
  { name: "campaign", align: "left" },
  { name: "status", align: "center" },
  { name: "created", align: "center" },
  { name: "completion", align: "center" },
];

export const generateCampaignStatsRows = (campaigns) => 
  campaigns.map(campaign => ({
    campaign: (
      <VuiBox display="flex" alignItems="center">
        <AssessmentIcon sx={{ fontSize: 20 }} />
        <VuiTypography pl="16px" color="white" variant="button" fontWeight="medium">
          {campaign.name}
        </VuiTypography>
      </VuiBox>
    ),
    status: <StatusBadge status={campaign.status} />,
    created: (
      <VuiTypography variant="caption" color="white" fontWeight="medium">
        {campaign.created_at}
      </VuiTypography>
    ),
    completion: <Completion value={campaign.completion} color="info" />,
  }));

export const getStatusIcon = (status) => {
  switch (status) {
    case 'draft':
      return <PendingActionsIcon />;
    case 'scheduled':
      return <PendingActionsIcon />;
    case 'running':
      return <RecordVoiceOverIcon />;
    case 'paused':
      return <PauseCircleIcon />;
    case 'completed':
      return <CheckCircleIcon />;
    default:
      return <AssessmentIcon />;
  }
};