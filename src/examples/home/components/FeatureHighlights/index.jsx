// Ecopharma/Ecopharm/src/examples/home/components/FeatureHighlights.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import ParticlesJs from '../../../../components/ParticlesJs/index';



export default function FeatureHighlights() {
  const theme = useTheme();

  return (
    <Box

      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(4),
      }}
    >

      <Typography variant="h2" gutterBottom>Our Features</Typography>
      <Typography variant="body1">Highlight the key features of your product or service.</Typography>
    
    
    
    </Box>
    
  );
}