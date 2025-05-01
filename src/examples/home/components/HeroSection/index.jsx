import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Button, Container } from '@mui/material';
import ParticlesJs from '../../../../components/ParticlesJs/index';

export default function HeroSection() {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'relative', minHeight: '80vh', overflow: 'hidden' }}>
      <ParticlesJs
        backgroundColor={theme.palette.primary.main}
        particleColor="#ffffff"
        particleCount={50}
        speed={3}
      >
        <Container
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            padding: theme.spacing(8),
            color: '#ffffff',
          }}
        >
          <Typography 
            variant="h1" 
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: theme.spacing(3),
              background: 'linear-gradient(45deg, #ffffff 30%, #e0e0e0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Next-Gen Call Center Solutions
          </Typography>
          
          <Typography 
            variant="h4" 
            sx={{
              fontSize: { xs: '1.2rem', md: '1.8rem' },
              textAlign: 'center',
              marginBottom: theme.spacing(6),
              maxWidth: '800px',
              opacity: 0.9
            }}
          >
            Empower your business with AI-driven insights and automated campaign management
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: theme.palette.primary.main,
                fontSize: '1.1rem',
                padding: '12px 32px',
                '&:hover': {
                  backgroundColor: '#ffffff',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease-in-out'
                }
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: '#ffffff',
                color: '#ffffff',
                fontSize: '1.1rem',
                padding: '12px 32px',
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease-in-out'
                }
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </ParticlesJs>
    </Box>
  );
}