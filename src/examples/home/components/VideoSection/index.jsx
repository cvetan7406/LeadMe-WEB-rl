import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Container, IconButton, Paper } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

export default function VideoSection() {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    const video = document.getElementById('product-video');
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[900],
        padding: theme.spacing(10, 3),
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', marginBottom: theme.spacing(6) }}>
          <Typography 
            variant="h2" 
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              background: 'linear-gradient(45deg, #ffffff 30%, #e0e0e0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            See It In Action
          </Typography>
          <Typography 
            variant="h5"
            sx={{ 
              color: theme.palette.grey[300],
              maxWidth: '800px',
              margin: '0 auto',
              fontSize: { xs: '1rem', md: '1.2rem' }
            }}
          >
            Watch how our AI-powered call center solution transforms business operations
          </Typography>
        </Box>

        <Paper 
          elevation={8}
          sx={{ 
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            '&:hover .play-overlay': {
              opacity: 1,
            },
          }}
        >
          {/* Video Thumbnail Overlay */}
          <Box
            className="play-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isPlaying ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out',
              cursor: 'pointer',
              zIndex: 1,
            }}
            onClick={handlePlayPause}
          >
            <IconButton
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'white',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
              size="large"
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Box>

          {/* Video Player */}
          <Box
            sx={{
              position: 'relative',
              paddingTop: '56.25%', // 16:9 Aspect Ratio
              backgroundColor: theme.palette.grey[800],
            }}
          >
            <video
              id="product-video"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              poster="/1.png"
              controls={isPlaying}
            >
              <source 
                src="https://www.youtube.com/watch?v=t7ReU_Pz4bk" 
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </Box>
        </Paper>

        {/* Video Features */}
        <Box 
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'center',
            marginTop: theme.spacing(6),
          }}
        >
          {[
            {
              title: 'AI-Powered Analytics',
              description: 'See how our AI analyzes call patterns in real-time'
            },
            {
              title: 'Smart Automation',
              description: 'Watch automated campaign management in action'
            },
            {
              title: 'Real Results',
              description: 'Learn how clients improved efficiency by 40%'
            }
          ].map((feature, index) => (
            <Box 
              key={index}
              sx={{
                flex: '1 1 300px',
                maxWidth: '350px',
                textAlign: 'center',
                padding: theme.spacing(2),
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ color: theme.palette.primary.light }}
              >
                {feature.title}
              </Typography>
              <Typography 
                variant="body1"
                sx={{ color: theme.palette.grey[400] }}
              >
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}