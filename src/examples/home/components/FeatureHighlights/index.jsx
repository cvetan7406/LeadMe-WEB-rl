import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Grid, Card, CardContent, Icon } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';

export default function FeatureHighlights() {
  const theme = useTheme();

  const features = [
    {
      icon: <AutoGraphIcon sx={{ fontSize: 40 }} />,
      title: "Advanced Analytics",
      description: "Real-time insights and performance metrics to optimize your campaigns"
    },
    {
      icon: <SmartToyIcon sx={{ fontSize: 40 }} />,
      title: "AI Assistant",
      description: "Smart automation and intelligent decision support for better outcomes"
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: "High Performance",
      description: "Lightning-fast processing and seamless campaign management"
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Enterprise Security",
      description: "Bank-grade security and compliance for your sensitive data"
    }
  ];

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(10, 3),
        position: 'relative'
      }}
    >
      <Box 
        sx={{
          textAlign: 'center',
          marginBottom: theme.spacing(8)
        }}
      >
        <Typography 
          variant="h2" 
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Powerful Features
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            color: theme.palette.text.secondary,
            maxWidth: '800px',
            margin: '0 auto',
            fontSize: { xs: '1rem', md: '1.2rem' }
          }}
        >
          Everything you need to run successful call center campaigns
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: theme.shadows[10],
                  '& .feature-icon': {
                    color: theme.palette.primary.main,
                    transform: 'scale(1.1)',
                  }
                }
              }}
            >
              <CardContent sx={{ 
                textAlign: 'center',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}>
                <Box 
                  className="feature-icon"
                  sx={{
                    color: theme.palette.text.secondary,
                    transition: 'all 0.3s ease-in-out',
                    marginBottom: 2
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography 
                  variant="h5" 
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    marginBottom: 1
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}