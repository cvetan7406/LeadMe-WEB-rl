// Ecopharma/Ecopharm/src/examples/home/components/Map.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

export default function Map() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(4),
      }}
    >
      <Typography variant="h2" gutterBottom>Our Location</Typography>
      <Typography variant="body1">Find us on the map.</Typography>
    </Box>
  );
}