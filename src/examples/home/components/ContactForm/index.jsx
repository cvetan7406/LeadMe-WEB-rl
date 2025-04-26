// Ecopharma/Ecopharm/src/examples/home/components/ContactForm.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

export default function ContactForm() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[200],
        padding: theme.spacing(4),
      }}
    >
      <Typography variant="h2" gutterBottom>Contact Us</Typography>
      <Typography variant="body1">Fill out the form to get in touch with us.</Typography>
    </Box>
  );
}