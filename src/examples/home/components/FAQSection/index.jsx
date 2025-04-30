// Ecopharma/Ecopharm/src/examples/home/components/FAQSection.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

export default function FAQSection() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(4),
      }}
    >
      <Typography variant="h2" gutterBottom>Frequently Asked Questions</Typography>
      <Typography variant="body1">Answers to common questions about our services.</Typography>
    </Box>
  );
}