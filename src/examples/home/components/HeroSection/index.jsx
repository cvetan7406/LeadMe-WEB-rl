import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Grid, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import ParticlesJs from '../../../../components/ParticlesJs/index';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

export default function HeroSection() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      <ParticlesJs />
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <MotionTypography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  mb: 2,
                }}
              >
                Transform Your Digital Experience
              </MotionTypography>
              <MotionTypography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Discover innovative solutions that elevate your online presence and drive success.
              </MotionTypography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <MotionButton
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    px: 4,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </MotionButton>
                <MotionButton
                  variant="outlined"
                  size="large"
                  sx={{ px: 4 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </MotionButton>
              </Box>
            </MotionBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(33,203,243,0.1) 0%, rgba(33,150,243,0) 70%)',
                  top: '-50%',
                  left: '-50%',
                  borderRadius: '50%',
                  animation: 'pulse 15s infinite',
                },
              }}
            >
              {/* Add your hero image or 3D element here */}
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}