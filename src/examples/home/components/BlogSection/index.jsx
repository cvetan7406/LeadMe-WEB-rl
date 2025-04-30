// Ecopharma/Ecopharm/src/examples/home/components/BlogSection.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

export default function BlogSection() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(4),
      }}
    >
      <Typography variant="h2" gutterBottom>Latest News</Typography>
      <Typography variant="body1">Read our latest blog posts and updates.</Typography>
    </Box>
  );
}