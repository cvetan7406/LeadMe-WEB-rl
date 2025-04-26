// Ecopharma/Ecopharm/src/examples/home/components/InteractiveElements.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

export default function InteractiveElements() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[100],
        padding: theme.spacing(4),
      }}
    >
      <Typography variant="h2" gutterBottom>Interactive Features</Typography>
      <Typography variant="body1">Engage with our interactive content.</Typography>
    </Box>
  );
}