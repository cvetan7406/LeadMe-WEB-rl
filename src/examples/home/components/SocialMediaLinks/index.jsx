import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Container, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function SocialMediaLinks() {
  const theme = useTheme();

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon />,
      url: 'https://linkedin.com',
      color: '#0077B5'
    },
    {
      name: 'Twitter',
      icon: <TwitterIcon />,
      url: 'https://twitter.com',
      color: '#1DA1F2'
    },
    {
      name: 'Facebook',
      icon: <FacebookIcon />,
      url: 'https://facebook.com',
      color: '#4267B2'
    },
    {
      name: 'YouTube',
      icon: <YouTubeIcon />,
      url: 'https://youtube.com',
      color: '#FF0000'
    },
    {
      name: 'Instagram',
      icon: <InstagramIcon />,
      url: 'https://instagram.com',
      color: '#E4405F'
    }
  ];

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 3),
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            Connect With Us
          </Typography>
          <Typography 
            variant="h5"
            sx={{ 
              color: theme.palette.text.secondary,
              maxWidth: '600px',
              margin: '0 auto',
              fontSize: { xs: '1rem', md: '1.2rem' }
            }}
          >
            Stay connected and follow us on social media for the latest updates
          </Typography>
        </Box>

        <Grid 
          container 
          spacing={3} 
          justifyContent="center"
          sx={{ maxWidth: '800px', margin: '0 auto' }}
        >
          {socialLinks.map((social, index) => (
            <Grid size={12} sm={4} md={2} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <IconButton
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 64,
                    height: 64,
                    backgroundColor: 'transparent',
                    border: `2px solid ${social.color}`,
                    color: social.color,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: social.color,
                      color: 'white',
                      transform: 'translateY(-5px)',
                      boxShadow: `0 5px 15px ${social.color}40`
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: 30
                    }
                  }}
                >
                  {social.icon}
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500
                  }}
                >
                  {social.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ 
          textAlign: 'center', 
          mt: 6,
          pt: 4,
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          <Typography 
            variant="subtitle1"
            sx={{ color: theme.palette.text.secondary }}
          >
            Follow us for exclusive content, industry insights, and special offers
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}