// Ecopharma/Ecopharm/src/examples/home/components/VideoSection.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

export default function VideoSection() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[200],
        padding: theme.spacing(4),
      }}
    >
      <Typography variant="h2" gutterBottom>Watch Our Video</Typography>
      <Typography variant="body1">Check out our latest video content.</Typography>
    </Box>
  );
}