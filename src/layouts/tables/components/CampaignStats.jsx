import { useState, useEffect } from "react";
import { Card, Grid, Icon, Skeleton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import VuiProgress from "../../../components/VuiProgress";
import Table from "../../../examples/Tables/Table";
import { useCampaignStats, campaignStatsColumns, generateCampaignStatsRows, getStatusIcon } from "../data/campaignStatsData";
import PhoneIcon from '@mui/icons-material/Phone';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import MicIcon from '@mui/icons-material/Mic';

// Stat card component
function StatCard({ title, value, icon, color, subtitle, progress, tooltipContent, linkTo }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (linkTo) {
      navigate(linkTo);
    }
  };

  return (
    <Card
      sx={{
        cursor: linkTo ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: linkTo ? 'scale(1.02)' : 'none',
        }
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tooltip
        open={isHovered && tooltipContent}
        title={
          <VuiBox p={1}>
            <VuiTypography variant="button" color="white">
              {tooltipContent}
            </VuiTypography>
          </VuiBox>
        }
        placement="top"
      >
        <VuiBox p={2}>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <VuiBox>
                <VuiTypography variant="button" color="text" fontWeight="medium">
                  {title}
                </VuiTypography>
                <VuiBox display="flex" alignItems="center">
                  <VuiTypography variant="h4" fontWeight="bold" color="white">
                    {value}
                  </VuiTypography>
                  {subtitle && (
                    <VuiTypography variant="caption" color="text" fontWeight="medium" ml={1}>
                      {subtitle}
                    </VuiTypography>
                  )}
                </VuiBox>
              </VuiBox>
            </Grid>
            <Grid item xs={4}>
              <VuiBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="4.5rem"
                height="4.5rem"
                borderRadius="xl"
                bgcolor={`${color}.focus`}
                color="white"
                shadow="md"
                ml="auto"
              >
                {icon}
              </VuiBox>
            </Grid>
          </Grid>
          {progress !== undefined && (
            <VuiBox mt={2}>
              <VuiProgress value={progress} color={color} sx={{ background: "#2D2E5F" }} label={false} />
            </VuiBox>
          )}
        </VuiBox>
      </Tooltip>
    </Card>
  );
}

function CampaignStats() {
  const { stats, loading } = useCampaignStats();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!loading && stats.recentCampaigns) {
      setRows(generateCampaignStatsRows(stats.recentCampaigns));
    }
  }, [loading, stats]);

  return (
    <VuiBox mb={3}>
      <Grid container spacing={3}>
        
        {/* Campaign Status Stats */}
        <Grid item xs={12} md={6} lg={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
          ) : (
            <StatCard
              title="Total Campaigns"
              value={stats.totalCampaigns}
              icon={<AssessmentIcon fontSize="large" />}
              color="info"
              tooltipContent={`View all ${stats.totalCampaigns} campaigns across all statuses`}
              linkTo="/tables/PendingCapaign"
            />
          )}
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
          ) : (
            <StatCard
              title="Active Campaigns"
              value={stats.statusCounts.running}
              icon={<RecordVoiceOverIcon fontSize="large" />}
              color="success"
              subtitle={`${Math.round((stats.statusCounts.running / stats.totalCampaigns) * 100)}% of total`}
              progress={Math.round((stats.statusCounts.running / stats.totalCampaigns) * 100)}
              tooltipContent={`${stats.statusCounts.running} campaigns currently running with active calls`}
              linkTo="/tables/custom?status=running"
            />
          )}
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
          ) : (
            <StatCard
              title="Scheduled Campaigns"
              value={stats.statusCounts.scheduled}
              icon={<PendingActionsIcon fontSize="large" />}
              color="warning"
              tooltipContent={`${stats.statusCounts.scheduled} campaigns scheduled for future execution`}
              linkTo="/tables/custom?status=scheduled"
            />
          )}
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
          ) : (
            <StatCard
              title="Completed Campaigns"
              value={stats.statusCounts.completed}
              icon={<CheckCircleIcon fontSize="large" />}
              color="success"
              tooltipContent={`${stats.statusCounts.completed} campaigns successfully completed`}
              linkTo="/tables/custom?status=completed"
            />
          )}
        </Grid>
        
        {/* Call Stats */}
        <Grid item xs={12} md={6} lg={4}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
          ) : (
            <StatCard
              title="Total Calls"
              value={stats.totalCalls}
              icon={<PhoneIcon fontSize="large" />}
              color="primary"
              tooltipContent={`Total of ${stats.totalCalls} calls made across all campaigns`}
              linkTo="/logs"
            />
          )}
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
          ) : (
            <StatCard
              title="Successful Calls"
              value={stats.successfulCalls}
              icon={<PhoneIcon fontSize="large" />}
              color="success"
              subtitle={`${Math.round((stats.successfulCalls / stats.totalCalls) * 100)}% success rate`}
              progress={Math.round((stats.successfulCalls / stats.totalCalls) * 100)}
              tooltipContent={`${stats.successfulCalls} successful calls out of ${stats.totalCalls} total calls`}
              linkTo="/logs?status=completed"
            />
          )}
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
          ) : (
            <StatCard
              title="Call Recordings"
              value={stats.totalRecordings}
              icon={<MicIcon fontSize="large" />}
              color="info"
              tooltipContent={`${stats.totalRecordings} recorded calls available for playback`}
              linkTo="/tables/components/CallRecordings"
            />
          )}
        </Grid>
        
        {/* Recent Campaigns Table - Commented out as per requirement */}
        {/* <Grid item xs={12}>
          <Card>
            <VuiBox
              sx={{
                "& th": {
                  borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                    `${borderWidth[1]} solid ${grey[700]}`,
                },
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                      `${borderWidth[1]} solid ${grey[700]}`,
                  },
                },
              }}
              p={3}
            >
              <VuiBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
                <VuiTypography variant="lg" color="white">
                  Recent Campaigns
                </VuiTypography>
              </VuiBox>
              
              {loading ? (
                <Skeleton variant="rectangular" height={200} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
              ) : (
                <Table
                  columns={campaignStatsColumns}
                  rows={rows}
                />
              )}
            </VuiBox>
          </Card>
        </Grid> */}
        
        {/* Campaign Status Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <VuiBox p={3}>
              <VuiBox mb={2}>
                <VuiTypography variant="lg" color="white">
                  Campaign Status Summary
                </VuiTypography>
              </VuiBox>
              
              {loading ? (
                <Skeleton variant="rectangular" height={200} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
              ) : (
                <VuiBox
                  sx={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: 'rgba(255, 255, 255, 0.5)',
                    },
                    paddingRight: '10px'
                  }}
                >
                  {Object.entries(stats.statusCounts).map(([status, count]) => (
                    <VuiBox key={status} mb={2}>
                      <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <VuiBox display="flex" alignItems="center">
                          <VuiBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="1.5rem"
                            height="1.5rem"
                            borderRadius="sm"
                            bgcolor={
                              status === 'completed' ? 'success.focus' :
                              status === 'running' ? 'info.focus' :
                              status === 'paused' ? 'warning.focus' :
                              status === 'scheduled' ? 'primary.focus' : 'secondary.focus'
                            }
                            color="white"
                            mr={2}
                          >
                            {getStatusIcon(status)}
                          </VuiBox>
                          <VuiTypography variant="button" color="white" fontWeight="medium">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </VuiTypography>
                        </VuiBox>
                        <VuiTypography variant="button" color="white" fontWeight="medium">
                          {count}
                        </VuiTypography>
                      </VuiBox>
                      <VuiProgress
                        value={Math.round((count / stats.totalCampaigns) * 100)}
                        color={
                          status === 'completed' ? 'success' :
                          status === 'running' ? 'info' :
                          status === 'paused' ? 'warning' :
                          status === 'scheduled' ? 'primary' : 'secondary'
                        }
                        sx={{ background: "#2D2E5F" }}
                        label={false}
                      />
                    </VuiBox>
                  ))}
                </VuiBox>
              )}
            </VuiBox>
          </Card>
        </Grid>
        
        {/* Call Success Rate */}
        <Grid item xs={12} md={6}>
          <Card>
            <VuiBox p={3}>
              <VuiBox mb={2}>
                <VuiTypography variant="lg" color="white">
                  Call Success Metrics
                </VuiTypography>
              </VuiBox>
              
              {loading ? (
                <Skeleton variant="rectangular" height={200} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
              ) : (
                <VuiBox
                  sx={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: 'rgba(255, 255, 255, 0.5)',
                    },
                    paddingRight: '10px'
                  }}
                >
                  <VuiBox mb={4}>
                    <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <VuiTypography variant="button" color="white" fontWeight="medium">
                        Success Rate
                      </VuiTypography>
                      <VuiTypography variant="button" color="white" fontWeight="medium">
                        {Math.round((stats.successfulCalls / stats.totalCalls) * 100)}%
                      </VuiTypography>
                    </VuiBox>
                    <VuiProgress
                      value={Math.round((stats.successfulCalls / stats.totalCalls) * 100)}
                      color="success"
                      sx={{ background: "#2D2E5F" }}
                      label={false}
                    />
                  </VuiBox>
                  
                  <VuiBox mb={4}>
                    <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <VuiTypography variant="button" color="white" fontWeight="medium">
                        Failed Rate
                      </VuiTypography>
                      <VuiTypography variant="button" color="white" fontWeight="medium">
                        {Math.round((stats.failedCalls / stats.totalCalls) * 100)}%
                      </VuiTypography>
                    </VuiBox>
                    <VuiProgress
                      value={Math.round((stats.failedCalls / stats.totalCalls) * 100)}
                      color="error"
                      sx={{ background: "#2D2E5F" }}
                      label={false}
                    />
                  </VuiBox>
                  
                  <VuiBox>
                    <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <VuiTypography variant="button" color="white" fontWeight="medium">
                        Recording Rate
                      </VuiTypography>
                      <VuiTypography variant="button" color="white" fontWeight="medium">
                        {Math.round((stats.totalRecordings / stats.totalCalls) * 100)}%
                      </VuiTypography>
                    </VuiBox>
                    <VuiProgress
                      value={Math.round((stats.totalRecordings / stats.totalCalls) * 100)}
                      color="info"
                      sx={{ background: "#2D2E5F" }}
                      label={false}
                    />
                  </VuiBox>
                </VuiBox>
              )}
            </VuiBox>
          </Card>
        </Grid>
      </Grid>
    </VuiBox>
  );
}

export default CampaignStats;