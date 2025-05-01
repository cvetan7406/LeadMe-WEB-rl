import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Container, Paper, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Map() {
  const theme = useTheme();

  const contactDetails = [
    {
      icon: <LocationOnIcon />,
      title: 'Address',
      content: '123 Business Avenue, Suite 100, New York, NY 10001',
      link: 'https://maps.google.com'
    },
    {
      icon: <PhoneIcon />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: <EmailIcon />,
      title: 'Email',
      content: 'contact@company.com',
      link: 'mailto:contact@company.com'
    },
    {
      icon: <AccessTimeIcon />,
      title: 'Business Hours',
      content: 'Mon - Fri: 9:00 AM - 6:00 PM',
      link: null
    }
  ];

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(10, 3),
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Map Section */}
          <Grid size={12} md={8}>
            <Paper
              elevation={4}
              sx={{
                height: '500px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                '&:hover': {
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564756836!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Location Map"
              />
            </Paper>
          </Grid>

          {/* Contact Details */}
          <Grid size={12} md={4}>
            <Box sx={{ height: '100%' }}>
              <Typography 
                variant="h2" 
                gutterBottom
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 4
                }}
              >
                Visit Us
              </Typography>

              {contactDetails.map((detail, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: theme.palette.background.paper,
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton 
                      className="contact-icon"
                      sx={{ 
                        backgroundColor: theme.palette.grey[100],
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      {detail.icon}
                    </IconButton>
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary"
                      >
                        {detail.title}
                      </Typography>
                      {detail.link ? (
                        <Typography 
                          variant="body1"
                          component="a"
                          href={detail.link}
                          sx={{ 
                            color: theme.palette.text.primary,
                            textDecoration: 'none',
                            '&:hover': {
                              color: theme.palette.primary.main
                            }
                          }}
                        >
                          {detail.content}
                        </Typography>
                      ) : (
                        <Typography variant="body1">
                          {detail.content}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}