import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  Typography, 
  Box, 
  Grid, 
  TextField, 
  Button, 
  IconButton, 
  Snackbar, 
  Alert,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Send as SendIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

export default function Subscribe() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'error'
      });
      return;
    }

    // Simulated API call
    setIsSubmitted(true);
    setSnackbar({
      open: true,
      message: 'Thank you for subscribing!',
      severity: 'success'
    });
    setTimeout(() => setIsSubmitted(false), 3000);
    setEmail('');
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        py: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Grid container justifyContent="center" spacing={3}>
          <Grid item xs={12} md={10} lg={8}>
            <MotionPaper
              elevation={24}
              sx={{
                background: 'linear-gradient(135deg, rgba(32,32,32,0.95) 0%, rgba(48,48,48,0.95) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Background Animation */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.1,
                  background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
                  animation: 'pulse 4s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.5)' },
                    '100%': { transform: 'scale(1)' }
                  }
                }}
              />

              <Box sx={{ p: 6, position: 'relative' }}>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <MotionBox
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <Typography 
                        variant="h3" 
                        color="white" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          backgroundClip: 'text',
                          textFillColor: 'transparent'
                        }}
                      >
                        Stay Updated
                      </Typography>
                      <Typography 
                        variant="h6" 
                        color="grey.400" 
                        sx={{ 
                          mb: 2,
                          maxWidth: '280px'
                        }}
                      >
                        Subscribe to our newsletter for the latest updates and exclusive content.
                      </Typography>
                    </MotionBox>
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <MotionBox
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <form onSubmit={handleSubmit} noValidate>
                        <Box sx={{ position: 'relative' }}>
                          <TextField
                            variant="outlined"
                            placeholder="Enter your email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                color: 'white',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255,255,255,0.2)',
                                },
                              },
                              '& .MuiOutlinedInput-input': {
                                '&::placeholder': {
                                  color: 'grey.500',
                                  opacity: 1,
                                },
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <EmailIcon sx={{ mr: 1, color: 'grey.500' }} />
                              ),
                            }}
                          />
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitted}
                            sx={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              borderRadius: '8px',
                              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)',
                              },
                            }}
                          >
                            {isSubmitted ? (
                              <CheckCircleIcon />
                            ) : (
                              <SendIcon />
                            )}
                          </Button>
                        </Box>
                      </form>
                    </MotionBox>
                  </Grid>
                </Grid>
              </Box>
            </MotionPaper>
          </Grid>
        </Grid>
      </MotionBox>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
