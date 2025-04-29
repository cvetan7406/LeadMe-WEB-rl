import { useState, useEffect } from "react";
import { Card, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import VuiButton from "@/components/VuiButton";
import VuiBox from "@/components/VuiBox";
import VuiTypography from "@/components/VuiTypography";
import LineChart from "@/examples/Charts/LineCharts/LineChart";
import colors from "@/assets/theme/base/colors";
import { supabase } from "@/config/supabaseClient";
import { BsCheckCircleFill } from "react-icons/bs";

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
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchedulerLogs();
    fetchTwilioCalls();
  }, []);

  const fetchSchedulerLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('scheduler_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setSchedulerLogs(data || []);
    } catch (err) {
      console.error('Error fetching scheduler logs:', err);
      setError('Failed to fetch scheduler logs');
    }
  };

  const fetchTwilioCalls = async () => {
    try {
      const { data, error } = await supabase
        .from('twilio_calls')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(100);

      if (error) throw error;
      setTwilioCalls(data || []);
      if (data) processCallMetrics(data);
    } catch (err) {
      console.error('Error fetching Twilio calls:', err);
      setError('Failed to fetch call records');
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchSchedulerLogs(), fetchTwilioCalls()]);
    setLoading(false);
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
      <Grid container spacing={3}>
        {/* Scheduler Logs Table */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            height: "100%",
            display: "flex",
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
              <TableContainer component={Paper} sx={{
                backgroundColor: "transparent",
                maxHeight: "400px",
                overflow: "auto",
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
                "& .MuiTableCell-root": {
                  borderColor: "rgba(255, 255, 255, 0.1)",
                },
                "& .MuiPaper-root": {
                  backgroundColor: "transparent",
                }
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "500",
                        borderBottom: "none",
                        backgroundColor: "transparent",
                        padding: "12px 20px"
                      }}>Time</TableCell>
                      <TableCell sx={{
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "500",
                        borderBottom: "none",
                        backgroundColor: "transparent",
                        padding: "12px 20px"
                      }}>Event</TableCell>
                      <TableCell sx={{
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "500",
                        borderBottom: "none",
                        backgroundColor: "transparent",
                        padding: "12px 20px"
                      }}>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedulerLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                          padding: "12px 20px"
                        }}>
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                          padding: "12px 20px"
                        }}>{log.event}</TableCell>
                        <TableCell sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                          padding: "12px 20px"
                        }}>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
             )}
           </VuiBox>
          </Card>
        </Grid>

        {/* Twilio Calls Table */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            height: "100%",
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
           <VuiBox p={3}>
             {loading ? (
                <VuiBox display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </VuiBox>
              ) : twilioCalls.length === 0 ? (
                <VuiTypography color="text" textAlign="center" p={3}>
                  No call records found
                </VuiTypography>
              ) : (
              <TableContainer component={Paper} sx={{
                backgroundColor: "transparent",
                maxHeight: "400px",
                overflow: "auto",
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
                "& .MuiTableCell-root": {
                  borderColor: "rgba(255, 255, 255, 0.1)",
                },
                "& .MuiPaper-root": {
                  backgroundColor: "transparent",
                }
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "500",
                        borderBottom: "none",
                        backgroundColor: "transparent",
                        padding: "12px 20px"
                      }}>Time</TableCell>
                      <TableCell sx={{
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "500",
                        borderBottom: "none",
                        backgroundColor: "transparent",
                        padding: "12px 20px"
                      }}>From</TableCell>
                      <TableCell sx={{
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "500",
                        borderBottom: "none",
                        backgroundColor: "transparent",
                        padding: "12px 20px"
                      }}>To</TableCell>
                      <TableCell sx={{
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "500",
                        borderBottom: "none",
                        backgroundColor: "transparent",
                        padding: "12px 20px"
                      }}>Status</TableCell>
                      <TableCell sx={{
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "500",
                        borderBottom: "none",
                        backgroundColor: "transparent",
                        padding: "12px 20px"
                      }}>Duration</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {twilioCalls.map((call) => (
                      <TableRow key={call.sid}>
                        <TableCell sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                          padding: "12px 20px"
                        }}>
                          {new Date(call.start_time).toLocaleString()}
                        </TableCell>
                        <TableCell sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                          padding: "12px 20px"
                        }}>{call.from_number}</TableCell>
                        <TableCell sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                          padding: "12px 20px"
                        }}>{call.to_number}</TableCell>
                        <TableCell sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                          padding: "12px 20px"
                        }}>{call.status}</TableCell>
                        <TableCell sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                          padding: "12px 20px"
                        }}>{call.duration}s</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
             )}
           </VuiBox>
          </Card>
        </Grid>

        {/* Call Volume Chart */}
        <Grid item xs={12}>
          <Card sx={{
            height: "100%",
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
            <VuiBox p={3}>
              <LineChart
                title="Daily Call Volume"
                description="Number of calls per day over the last 7 days"
                chart={callVolumeChart}
                height="300px"
              />
            </VuiBox>
          </Card>
        </Grid>
      </Grid>
      </VuiBox>
    </DashboardLayout>
  );
}

export default LogsMonitoring;