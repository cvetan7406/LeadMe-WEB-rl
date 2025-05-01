import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  TextField, 
  Button, 
  Paper,
  IconButton,
  MenuItem,
  CircularProgress
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';

export default function ContactForm() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    interest: '',
    message: ''
  });

  const interests = [
    'AI-Powered Call Analytics',
    'Campaign Management',
    'Performance Optimization',
    'Integration Services',
    'Custom Solutions'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      interest: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: <EmailIcon />,
      title: 'Email Us',
      content: 'contact@company.com',
      link: 'mailto:contact@company.com'
    },
    {
      icon: <PhoneIcon />,
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: <LocationOnIcon />,
      title: 'Visit Us',
      content: '123 Business Ave, Suite 100, New York, NY 10001',
      link: 'https://maps.google.com'
    }
  ];

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(10, 3),
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h2" 
                gutterBottom
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Get in Touch
              </Typography>
              <Typography 
                variant="h5"
                sx={{ 
                  color: theme.palette.text.secondary,
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.2rem' }
                }}
              >
                Ready to transform your call center operations? We're here to help!
              </Typography>
            </Box>

            {contactInfo.map((info, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateX(10px)',
                    borderColor: theme.palette.primary.main,
                    '& .contact-icon': {
                      color: theme.palette.primary.main,
                      transform: 'scale(1.1)'
                    }
                  }
                }}
              >
                <IconButton 
                  className="contact-icon"
                  sx={{ 
                    backgroundColor: theme.palette.grey[100],
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  {info.icon}
                </IconButton>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {info.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    component="a"
                    href={info.link}
                    sx={{ 
                      color: theme.palette.text.primary,
                      textDecoration: 'none',
                      '&:hover': {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    {info.content}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper
              }}
            >
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="What interests you?"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    >
                      {interests.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={loading}
                      endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                      sx={{
                        py: 1.5,
                        mt: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          transition: 'transform 0.3s ease-in-out'
                        }
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}