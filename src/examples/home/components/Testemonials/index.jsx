// Ecopharma/Ecopharm/src/examples/home/components/Testimonials.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

export default function Testimonials() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[100],
        padding: theme.spacing(4),
      }}
    >
      <Typography variant="h2" gutterBottom>What Our Customers Say</Typography>
      <Typography variant="body1">Customer testimonials and reviews.</Typography>
    </Box>
  );
}