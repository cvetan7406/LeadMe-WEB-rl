import React from 'react';
import { Card, Grid } from '@mui/material';
import VuiBox from '../../../../components/VuiBox';
import VuiTypography from '../../../../components/VuiTypography';
import GreenLightning from '../../../../assets/images/shapes/green-lightning.svg';
import WhiteLightning from '../../../../assets/images/shapes/white-lightning.svg';
import colors from '../../../../assets/theme/base/colors';
import carProfile from '../../../../assets/images/shapes/car-profile.svg';
import LineChart from '../../../../examples/Charts/LineCharts/LineChart';
import { lineChartDataProfile1 } from '../../data/lineChartData1';
import { lineChartDataProfile2 } from '../../data/lineChartData2';
import { lineChartOptionsProfile1 } from '../../data/lineChartOptions1';
import { lineChartOptionsProfile2 } from '../../data/lineChartOptions2';
import CircularProgress from '@mui/material/CircularProgress';

const CarInformations = () => {
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
						Car Informations
					</VuiTypography>
					<VuiTypography variant='button' color='text' fontWeight='regular'>
						Hello, Mark Johnson
					</VuiTypography>
				</VuiBox>

				<Grid container spacing={3} sx={{ width: '100%' }}>
					<Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<VuiBox sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
							<CircularProgress
								variant='determinate'
								value={70}
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
									98%
								</VuiTypography>
								<VuiTypography color='text' variant='caption'>
									Current Load
								</VuiTypography>
							</VuiBox>
						</VuiBox>

						<VuiBox textAlign='center'>
							<VuiTypography color='white' variant='lg' fontWeight='bold'>
								0h 58 min
							</VuiTypography>
							<VuiTypography color='text' variant='button' fontWeight='regular'>
								Time to full charge
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
											Battery Health
										</VuiTypography>
										<VuiTypography color='white' variant='h4' fontWeight='bold'>
											99%
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
										<VuiBox component='img' src={carProfile} />
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
											Voltage Now
										</VuiTypography>
										<VuiTypography color='white' variant='h4' fontWeight='bold'>
											57%
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
											Range
										</VuiTypography>
										<VuiTypography color='white' variant='h4' fontWeight='bold'>
											157k%
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
											Energy
										</VuiTypography>
										<VuiTypography color='white' variant='h4' fontWeight='bold'>
											84%
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
								<VuiBox sx={{ height: '200px', overflow: 'visible' }}>
									<LineChart
										chart={{
											data: lineChartDataProfile1,
											options: lineChartOptionsProfile1
										}}
									/>
								</VuiBox>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<VuiBox sx={{ height: '200px', overflow: 'visible' }}>
									<LineChart sx={{ height: '280px' }}
										chart={{
											data: lineChartDataProfile2,
											options: lineChartOptionsProfile2
										}}
									/>
								</VuiBox>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</VuiBox>
		</Card>
	);
};

export default CarInformations;
