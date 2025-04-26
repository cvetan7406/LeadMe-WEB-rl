// Ecopharma/Ecopharm/src/examples/home/components/SocialMediaLinks.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

export default function SocialMediaLinks() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(4),
      }}
    >
      <Typography variant="h2" gutterBottom>Follow Us</Typography>
      <Typography variant="body1">Links to our social media profiles.</Typography>
    </Box>
  );
}