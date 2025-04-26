// Ecopharma/Ecopharm/src/examples/home/components/HeroSection.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import ParticlesJs from '../../../../components/ParticlesJs/index';



export default function HeroSection() {
  const theme = useTheme();

  return (
      <Box
      sx={{
        backgroundColor: theme.palette.primary.transparent,
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(4),
        textAlign: 'center',
      }}
    >
      <Typography variant="h1">Welcome to Our Website</Typography>
      <Typography variant="subtitle1">Discover our amazing products and services.</Typography>
    </Box>
  );
}