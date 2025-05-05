import { useState, useEffect } from "react";
import { Card, Grid, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import VuiButton from "@/components/VuiButton";
import VuiBox from "@/components/VuiBox";
import VuiTypography from "@/components/VuiTypography";
import LineChart from "@/examples/Charts/LineCharts/LineChart";
import colors from "@/assets/theme/base/colors";
import { supabase } from "@/config/supabaseClient";
import { BsCheckCircleFill } from "react-icons/bs";
import Table from "@/examples/Tables/Table";

// Layout components
import DashboardLayout from "@/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "@/examples/Navbars/DashboardNavbar";

function LogsMonitoring() {
  const [schedulerLogs, setSchedulerLogs] = useState([]);
  const [twilioCalls, setTwilioCalls] = useState([]);
  const [callMetrics, setCallMetrics] = useState({
    labels: [],
    data: []
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingMoreLogs, setLoadingMoreLogs] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [logsPage, setLogsPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreLogs, setHasMoreLogs] = useState(true);

  useEffect(() => {
    fetchSchedulerLogs();
    fetchTwilioCalls();
  }, []);

  const fetchSchedulerLogs = async (isLoadingMore = false) => {
    try {
      if (!isLoadingMore) {
        setLoading(true);
        setLogsPage(0);
      } else {
        setLoadingMoreLogs(true);
      }

      const { data, error } = await supabase
        .from('scheduler_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(logsPage * 50, (logsPage + 1) * 50 - 1);

      if (error) throw error;

      const sortedData = data || [];
      if (isLoadingMore) {
        setSchedulerLogs(prev => [...prev, ...sortedData]);
      } else {
        setSchedulerLogs(sortedData);
      }

      setHasMoreLogs(data?.length === 50);
    } catch (err) {
      console.error('Error fetching scheduler logs:', err);
      setError('Failed to fetch scheduler logs');
    } finally {
      if (isLoadingMore) {
        setLoadingMoreLogs(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleLogsScroll = async (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMoreLogs && !loadingMoreLogs) {
      setLogsPage(prev => prev + 1);
      await fetchSchedulerLogs(true);
    }
  };

  const fetchTwilioCalls = async (isLoadingMore = false) => {
    try {
      if (!isLoadingMore) {
        setLoading(true);
        setPage(0);
      } else {
        setLoadingMore(true);
      }

      const { data, error } = await supabase
        .from('twilio_calls')
        .select('*')
        .order('start_time', { ascending: false })
        .range(page * 50, (page + 1) * 50 - 1);

      if (error) throw error;

      const sortedData = data || [];
      if (isLoadingMore) {
        setTwilioCalls(prev => [...prev, ...sortedData]);
      } else {
        setTwilioCalls(sortedData);
        if (sortedData.length > 0) processCallMetrics(sortedData);
      }

      setHasMore(data?.length === 50);
    } catch (err) {
      console.error('Error fetching Twilio calls:', err);
      setError('Failed to fetch call records');
    } finally {
      if (isLoadingMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleScroll = async (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loadingMore) {
      setPage(prev => prev + 1);
      await fetchTwilioCalls(true);
    }
  };

  const scrollToTop = (element) => {
    if (element) {
      element.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    setPage(0);
    setLogsPage(0);
    setHasMore(true);
    setHasMoreLogs(true);
    await Promise.all([fetchSchedulerLogs(), fetchTwilioCalls()]);
    setLoading(false);
    
    // Scroll both tables to top after refresh
    const callsTable = document.querySelector('#calls-table');
    const logsTable = document.querySelector('#logs-table');
    scrollToTop(callsTable);
    scrollToTop(logsTable);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const processCallMetrics = (calls) => {
    // Group calls by day and count
    const dailyCounts = calls.reduce((acc, call) => {
      const date = new Date(call.start_time).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Convert to chart format
    const labels = Object.keys(dailyCounts).slice(-7); // Last 7 days
    const data = labels.map(date => dailyCounts[date] || 0);

    setCallMetrics({ labels, data });
  };

  const callVolumeChart = {
    data: [{
      name: "Call Volume",
      data: callMetrics.data
    }],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      colors: [colors.info.main],
      stroke: {
        curve: "smooth",
        width: 3
      },
      xaxis: {
        categories: callMetrics.labels,
        labels: {
          style: {
            colors: "#c8cfca",
            fontSize: "10px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#c8cfca",
            fontSize: "10px",
          },
        },
      },
      tooltip: {
        theme: "dark",
      },
      grid: {
        strokeDashArray: 5,
        borderColor: "#56577A"
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3} px={3}>
      <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'stretch' }}>
        {/* Recent Calls Table */}
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Card sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px" p={3}>
              <VuiBox>
                <VuiTypography color="white" variant="lg" mb="6px" gutterBottom>
                  Recent Calls
                </VuiTypography>
                <VuiBox display="flex" alignItems="center" lineHeight={0}>
                  <BsCheckCircleFill color="green" size="15px" />
                  <VuiTypography variant="button" fontWeight="regular" color="text" ml="5px">
                    &nbsp;<strong>{twilioCalls.length}</strong> Total Calls
                  </VuiTypography>
                </VuiBox>
              </VuiBox>
           </VuiBox>
           <VuiBox p={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
             {loading ? (
                <VuiBox display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </VuiBox>
              ) : twilioCalls.length === 0 ? (
                <VuiTypography color="text" textAlign="center" p={3}>
                  No call records found
                </VuiTypography>
              ) : (
              <VuiBox
                id="calls-table"
                sx={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  scrollBehavior: "smooth"
                }}
                onScroll={handleScroll}
              >
                <Table
                  columns={[
                    { name: "Time", accessor: "time", align: "left" },
                    { name: "From", accessor: "from", align: "left" },
                    { name: "To", accessor: "to", align: "left" },
                    { name: "Status", accessor: "status", align: "left" },
                    { name: "Duration", accessor: "duration", align: "left" }
                  ]}
                  rows={twilioCalls.map(call => ({
                    id: call.sid,
                    time: new Date(call.start_time).toLocaleString(),
                    from: call.from_number,
                    to: call.to_number,
                    status: call.status,
                    duration: `${call.duration}s`
                  }))}
                />
                {loadingMore && (
                  <VuiBox display="flex" justifyContent="center" p={2}>
                    <CircularProgress size={20} />
                  </VuiBox>
                )}
              </VuiBox>
             )}
           </VuiBox>
          </Card>
        </Grid>

        {/* Call Volume Chart */}
        <Grid item xs={12} md={6} >
          <Card sx={{
            height: "100%",
            width: "850px",
            display: "flex",
            flexDirection: "column",
          }}>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px" p={3}>
              <VuiBox>
                <VuiTypography color="white" variant="lg" mb="6px" gutterBottom>
                  Call Volume Trends
                </VuiTypography>
                <VuiBox display="flex" alignItems="center" lineHeight={0}>
                  <BsCheckCircleFill color="green" size="15px" />
                  <VuiTypography variant="button" fontWeight="regular" color="text" ml="5px">
                    &nbsp;Last 7 Days
                  </VuiTypography>
                </VuiBox>
              </VuiBox>
            </VuiBox>
            <VuiBox p={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <LineChart
                title="Daily Call Volume"
                description="Number of calls per day over the last 7 days"
                chart={callVolumeChart}
                height="300px"
              />
              {loadingMoreLogs && (
                <VuiBox display="flex" justifyContent="center" p={2}>
                  <CircularProgress size={20} />
                </VuiBox>
              )}
            </VuiBox>
          </Card>
        </Grid>

        {/* Scheduler Logs Table */}
        <Grid item sx={ {width: "100%"} } md={12} >
          <Card sx={{
            height: "100%",
            display: "flex",
            width: "100%",
            flexDirection: "column",
          }}>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px" p={3}>
              <VuiBox>
                <VuiTypography color="white" variant="lg" mb="6px" gutterBottom>
                  Scheduler Logs
                </VuiTypography>
                <VuiBox display="flex" alignItems="center" lineHeight={0}>
                  <BsCheckCircleFill color="green" size="15px" />
                  <VuiTypography variant="button" fontWeight="regular" color="text" ml="5px">
                    &nbsp;<strong>{schedulerLogs.length}</strong> Total Events
                  </VuiTypography>
                </VuiBox>
              </VuiBox>
              <VuiBox display="flex" alignItems="center" gap={2}>
                <VuiButton
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={refreshData}
                  disabled={loading}
                >
                  Refresh
                </VuiButton>
              </VuiBox>
            </VuiBox>
            <VuiBox p={3}>
              {error && (
                <VuiTypography color="error" mb={2}>
                  {error}
                </VuiTypography>
              )}
              {loading ? (
                <VuiBox display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </VuiBox>
              ) : schedulerLogs.length === 0 ? (
                <VuiTypography color="text" textAlign="center" p={3}>
                  No scheduler logs found
                </VuiTypography>
              ) : (
              <VuiBox
                id="logs-table"
                sx={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  scrollBehavior: "smooth"
                }}
                onScroll={handleLogsScroll}
              >
                <Table
                  columns={[
                    { name: "Time", accessor: "time", align: "left" },
                    { name: "Event", accessor: "event", align: "left" },
                    { name: "Details", accessor: "details", align: "left" }
                  ]}
                  rows={schedulerLogs.map(log => ({
                    id: log.id,
                    time: new Date(log.created_at).toLocaleString(),
                    event: log.event,
                    details: log.details
                  }))}
                />
              </VuiBox>
              )}
            </VuiBox>
          </Card>
        </Grid>
      </Grid>
      </VuiBox>
    </DashboardLayout>
  );
}

export default LogsMonitoring;