import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Container, TextField, Button, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import SendIcon from '@mui/icons-material/Send';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function Subscribe() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setEmail('');
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        padding: theme.spacing(10, 3),
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `linear-gradient(45deg, ${theme.palette.common.white} 25%, transparent 25%) -40px 0,
                      linear-gradient(-45deg, ${theme.palette.common.white} 25%, transparent 25%) -40px 0,
                      linear-gradient(45deg, transparent 75%, ${theme.palette.common.white} 75%),
                      linear-gradient(-45deg, transparent 75%, ${theme.palette.common.white} 75%)`,
          backgroundSize: '80px 80px'
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={12} sx={{ textAlign: 'center', mb: 4 }}>
            <NotificationsActiveIcon 
              sx={{ 
                fontSize: 40, 
                color: 'white',
                mb: 2
              }} 
            />
            <Typography 
              variant="h3" 
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 2
              }}
            >
              Stay Updated
            </Typography>
            <Typography 
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              Subscribe to our newsletter for the latest updates, industry insights, and exclusive offers
            </Typography>
          </Grid>

          <Grid size={12}>
            <Paper
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: '4px',
                display: 'flex',
                maxWidth: '500px',
                margin: '0 auto',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '50px',
                boxShadow: theme.shadows[10]
              }}
            >
              <TextField
                fullWidth
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="standard"
                sx={{
                  ml: 2,
                  flex: 1,
                  '& .MuiInput-underline:before': { display: 'none' },
                  '& .MuiInput-underline:after': { display: 'none' },
                  '& .MuiInput-underline:hover:not(.Mui-disabled):before': { display: 'none' }
                }}
                InputProps={{
                  type: 'email',
                  required: true
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={<SendIcon />}
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  m: 0.5,
                  backgroundColor: theme.palette.primary.dark,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease-in-out'
                  }
                }}
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
