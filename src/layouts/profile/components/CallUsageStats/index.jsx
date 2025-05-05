import React, { useState, useEffect } from 'react';
import { Card, Grid } from '@mui/material';
import VuiBox from '../../../../components/VuiBox';
import VuiTypography from '../../../../components/VuiTypography';
import GreenLightning from '../../../../assets/images/shapes/green-lightning.svg';
import WhiteLightning from '../../../../assets/images/shapes/white-lightning.svg';
import colors from '../../../../assets/theme/base/colors';
import PhoneIcon from '@mui/icons-material/Phone';
import LineChart from '../../../../examples/Charts/LineCharts/LineChart';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '../../../../config/supabaseClient';
import { lineChartOptionsProfile1 } from '../../data/lineChartOptions1';

const CallUsageStats = () => {
  const [callStats, setCallStats] = useState({
    totalCalls: 0,
    callsByHour: {},
    last24Hours: {},
    successRate: 0,
    remainingCalls: 2500,
    peakHour: '00'
  });

  const [recordings, setRecordings] = useState([]);

  const fetchRecordings = async () => {
    try {
      // Get all recordings
      const { data: allRecordings } = await supabase
        .from('twilio_call_recordings')
        .select('*')
        .order('inserted_at', { ascending: false });

      if (allRecordings) {
        setRecordings(allRecordings);
      }
    } catch (error) {
      console.error('Error fetching recordings:', error);
    }
  };

  useEffect(() => {
    // Initial fetch of recordings
    fetchRecordings();
  }, []);

  useEffect(() => {
    const fetchCallData = async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get all calls for this month with their timestamps
      const { data: calls } = await supabase
        .from('twilio_calls')
        .select('start_time, status')
        .gte('start_time', startOfMonth.toISOString())
        .order('start_time', { ascending: true });

      if (!calls) return;

      // Process calls into hourly buckets
      const callsByHour = {};
      let totalCalls = 0;
      let successfulCalls = 0;

      calls.forEach(call => {
        totalCalls++;
        if (call.status === 'completed') successfulCalls++;
        
        const date = new Date(call.start_time);
        const hourKey = date.toISOString().slice(0, 13); // Group by hour (YYYY-MM-DDTHH)
        callsByHour[hourKey] = (callsByHour[hourKey] || 0) + 1;
      });

      // Get last 24 hours data
      const last24Hours = {};
      const last24 = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      Object.entries(callsByHour).forEach(([time, count]) => {
        if (new Date(time) >= last24) {
          last24Hours[time] = count;
        }
      });

      // Find peak hour
      const peakEntry = Object.entries(callsByHour)
        .sort(([, a], [, b]) => b - a)[0];
      const peakHour = peakEntry ?
        new Date(peakEntry[0]).toLocaleString('en-US', { hour: 'numeric' }) :
        '12 AM';

      setCallStats({
        totalCalls,
        callsByHour,
        last24Hours,
        successRate: totalCalls ? Math.round((successfulCalls / totalCalls) * 100) : 0,
        remainingCalls: 2500 - totalCalls,
        peakHour
      });
    };

    fetchCallData();
  }, []);
	const { info } = colors;

	return (
		<Card
			sx={{
				background: 'linear-gradient(126.97deg, rgba(6, 11, 40, 0.74) 28.26%, rgba(10, 14, 35, 0.71) 91.2%)',
				borderRadius: '20px',
				minHeight: '500px',
				height: 'auto',
				overflow: 'visible'
			}}
		>
			<VuiBox p={3} pb={18} sx={{ height: '100%', overflow: 'visible' }}>
				<VuiBox display="flex" alignItems="center" mb={2}>
					<VuiTypography variant='lg' color='white' fontWeight='bold' mr={1}>
						Call Usage Statistics
					</VuiTypography>
					<VuiTypography variant='button' color='text' fontWeight='regular'>
						Monthly Limit: 2500 calls
					</VuiTypography>
				</VuiBox>

				<Grid container spacing={3} sx={{ width: '100%' }}>
					<Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<VuiBox sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
							<CircularProgress
								variant='determinate'
								value={(callStats.totalCalls / 2500) * 100}
								size={200}
								color='info'
								sx={{
									'& .MuiCircularProgress-circle': {
										strokeWidth: 4
									}
								}}
							/>
							<VuiBox
								sx={{
									top: 0,
									left: 0,
									bottom: 0,
									right: 0,
									position: 'absolute',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<VuiBox component='img' src={GreenLightning} mb={1} />
								<VuiTypography color='white' variant='h2' fontWeight='bold'>
									{Math.round((callStats.totalCalls / 2500) * 100)}%
								</VuiTypography>
								<VuiTypography color='text' variant='caption'>
									Monthly Usage
								</VuiTypography>
							</VuiBox>
						</VuiBox>

						<VuiBox textAlign='center'>
							<VuiTypography color='white' variant='lg' fontWeight='bold'>
								{callStats.totalCalls} / 2500
							</VuiTypography>
							<VuiTypography color='text' variant='button' fontWeight='regular'>
								Total Calls This Month
							</VuiTypography>
						</VuiBox>
					</Grid>

					<Grid size={{ xs: 12, md: 7 }} sx={{ width: '100%' }}>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, sm: 6 }}>
								<VuiBox
									display='flex'
									p='18px'
									alignItems='center'
									sx={{
										background: 'rgba(0, 0, 0, 0.2)',
										borderRadius: '20px'
									}}
								>
									<VuiBox display='flex' flexDirection='column' mr='auto'>
										<VuiTypography color='text' variant='caption' fontWeight='medium' mb='2px'>
											Success Rate
										</VuiTypography>
										<VuiTypography color='white' variant='h4' fontWeight='bold'>
											{callStats.successRate}%
										</VuiTypography>
									</VuiBox>
									<VuiBox
										display='flex'
										justifyContent='center'
										alignItems='center'
										sx={{
											background: info.main,
											borderRadius: '12px',
											width: '56px',
											height: '56px'
										}}
									>
										<PhoneIcon sx={{ color: 'white', fontSize: 24 }} />
									</VuiBox>
								</VuiBox>
							</Grid>

							<Grid size={{ xs: 12, sm: 6 }}>
								<VuiBox
									display='flex'
									p='18px'
									alignItems='center'
									sx={{
										background: 'rgba(0, 0, 0, 0.2)',
										borderRadius: '20px'
									}}
								>
									<VuiBox display='flex' flexDirection='column' mr='auto'>
										<VuiTypography color='text' variant='caption' fontWeight='medium' mb='2px'>
											Daily Usage
										</VuiTypography>
										<VuiTypography color='white' variant='h4' fontWeight='bold'>
											{Math.round(callStats.totalCalls / 30)}
										</VuiTypography>
									</VuiBox>
									<VuiBox
										display='flex'
										justifyContent='center'
										alignItems='center'
										sx={{
											background: info.main,
											borderRadius: '12px',
											width: '56px',
											height: '56px'
										}}
									>
										<VuiBox component='img' src={WhiteLightning} />
									</VuiBox>
								</VuiBox>
							</Grid>

							<Grid size={{ xs: 12, sm: 6 }}>
								<VuiBox
									display='flex'
									p='18px'
									alignItems='center'
									sx={{
										background: 'rgba(0, 0, 0, 0.2)',
										borderRadius: '20px'
									}}
								>
									<VuiBox display='flex' flexDirection='column' mr='auto'>
										<VuiTypography color='text' variant='caption' fontWeight='medium' mb='2px'>
											Remaining
										</VuiTypography>
										<VuiTypography color='white' variant='h4' fontWeight='bold'>
											{callStats.remainingCalls}
										</VuiTypography>
									</VuiBox>
									<VuiBox
										display='flex'
										justifyContent='center'
										alignItems='center'
										sx={{
											background: info.main,
											borderRadius: '12px',
											width: '56px',
											height: '56px'
										}}
									>
										<VuiBox component='img' src={WhiteLightning} />
									</VuiBox>
								</VuiBox>
							</Grid>

							<Grid size={{ xs: 12, sm: 6 }}>
								<VuiBox
									display='flex'
									p='18px'
									alignItems='center'
									sx={{
										background: 'rgba(0, 0, 0, 0.2)',
										borderRadius: '20px'
									}}
								>
									<VuiBox display='flex' flexDirection='column' mr='auto'>
										<VuiTypography color='text' variant='caption' fontWeight='medium' mb='2px'>
											Peak Hour
										</VuiTypography>
										<VuiTypography color='white' variant='h4' fontWeight='bold'>
											{callStats.peakHour}
										</VuiTypography>
									</VuiBox>
									<VuiBox
										display='flex'
										justifyContent='center'
										alignItems='center'
										sx={{
											background: info.main,
											borderRadius: '12px',
											width: '56px',
											height: '56px'
										}}
									>
										<VuiBox component='img' src={WhiteLightning} />
									</VuiBox>
								</VuiBox>
							</Grid>
						</Grid>
					</Grid>

					<Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, sm: 6 }}>
								<LineChart
									title="Daily Call Volume"
									description="Number of calls per day"
									chart={{
										data: [{
											name: "Daily Calls",
											data: Object.entries(callStats.callsByHour)
												.sort(([a], [b]) => new Date(a) - new Date(b))
												.map(([, count]) => count)
										}],
										options: {
											...lineChartOptionsProfile1,
											xaxis: {
												...lineChartOptionsProfile1.xaxis,
												categories: Object.entries(callStats.callsByHour)
													.sort(([a], [b]) => new Date(a) - new Date(b))
													.map(([time]) => {
														const date = new Date(time);
														return date.toLocaleString('en-US', {
															month: 'short',
															day: 'numeric',
															hour: 'numeric'
														});
													})
											},
											yaxis: {
												...lineChartOptionsProfile1.yaxis,
												title: {
													text: "Calls",
													style: {
														color: "#c8cfca",
														fontSize: "12px"
													}
												}
											}
										}
									}}
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<LineChart
									title="Last 24 Hours"
									description="Call volume by hour"
									chart={{
										data: [{
											name: "Hourly Calls",
											data: Object.entries(callStats.last24Hours)
												.sort(([a], [b]) => new Date(a) - new Date(b))
												.map(([, count]) => count)
										}],
										options: {
											...lineChartOptionsProfile1,
											xaxis: {
												...lineChartOptionsProfile1.xaxis,
												categories: Object.entries(callStats.last24Hours)
													.sort(([a], [b]) => new Date(a) - new Date(b))
													.map(([time]) => {
														const date = new Date(time);
														return date.toLocaleString('en-US', {
															hour: 'numeric'
														});
													})
											},
											yaxis: {
												...lineChartOptionsProfile1.yaxis,
												title: {
													text: "Calls",
													style: {
														color: "#c8cfca",
														fontSize: "12px"
													}
												}
											}
										}
									}}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				    {/* Recordings Section */}
				    <Grid container spacing={2} sx={{ mt: 3 }}>
				      <Grid item xs={12}>
				        <Card
				          sx={{
				            background: 'linear-gradient(126.97deg, rgba(6, 11, 40, 0.74) 28.26%, rgba(10, 14, 35, 0.71) 91.2%)',
				            borderRadius: '20px',
				            minHeight: '100px'
				          }}
				        >
				          <VuiBox p={3}>
				            <VuiTypography variant="lg" color="white" fontWeight="bold" mb={2}>
				              Call Recordings
				            </VuiTypography>
				            
				            <Grid container spacing={2}>
				              {recordings.map((recording) => (
				                <Grid item xs={12} sm={6} md={4} key={recording.recording_sid}>
				                  <VuiBox
				                    p={2}
				                    sx={{
				                      background: 'rgba(0, 0, 0, 0.2)',
				                      borderRadius: '10px',
				                      display: 'flex',
				                      alignItems: 'center',
				                      justifyContent: 'space-between'
				                    }}
				                  >
				                    <VuiBox>
				                      <VuiTypography color="white" variant="button" fontWeight="bold">
				                        Duration: {Math.floor(recording.duration / 60)}:{(recording.duration % 60).toString().padStart(2, '0')}
				                      </VuiTypography>
				                      <VuiTypography color="text" variant="caption" display="block">
				                        {new Date(recording.inserted_at).toLocaleString()}
				                      </VuiTypography>
				                    </VuiBox>
				                    {recording.uri && (
				                      <VuiBox
				                        component="a"
				                        href={recording.uri}
				                        target="_blank"
				                        rel="noopener noreferrer"
				                        sx={{
				                          background: info.main,
				                          borderRadius: '8px',
				                          p: 1,
				                          display: 'flex',
				                          alignItems: 'center',
				                          cursor: 'pointer'
				                        }}
				                      >
				                        <PhoneIcon sx={{ color: 'white', fontSize: 20 }} />
				                      </VuiBox>
				                    )}
				                  </VuiBox>
				                </Grid>
				              ))}
				            </Grid>
				          </VuiBox>
				        </Card>
				      </Grid>
				    </Grid>
			</VuiBox>
		</Card>
	);
};

export default CallUsageStats;
