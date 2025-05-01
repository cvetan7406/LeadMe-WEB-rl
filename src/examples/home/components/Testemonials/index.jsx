import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Avatar, Rating, IconButton, Paper } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

export default function Testimonials() {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      position: "Call Center Manager",
      company: "Global Solutions Inc.",
      avatar: "/1.png",
      rating: 5,
      text: "The AI-powered insights have transformed how we run our campaigns. Our efficiency has improved by 40% since implementing this solution."
    },
    {
      name: "Michael Chen",
      position: "Operations Director",
      company: "TechCorp",
      avatar: "/1.png",
      rating: 5,
      text: "The automated campaign management has streamlined our operations significantly. The real-time analytics are a game-changer for our decision-making process."
    },
    {
      name: "Emily Rodriguez",
      position: "Customer Success Lead",
      company: "InnovateNow",
      avatar: "/1.png",
      rating: 5,
      text: "Outstanding platform with intuitive features. Our team adapted quickly, and the results have been remarkable. Highly recommend!"
    }
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[100],
        padding: theme.spacing(10, 3),
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ 
        textAlign: 'center',
        marginBottom: theme.spacing(8)
      }}>
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
          What Our Clients Say
        </Typography>
        <Typography 
          variant="h5"
          sx={{ 
            color: theme.palette.text.secondary,
            maxWidth: '800px',
            margin: '0 auto',
            fontSize: { xs: '1rem', md: '1.2rem' }
          }}
        >
          Trusted by leading companies worldwide
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        position: 'relative'
      }}>
        <IconButton 
          onClick={handlePrev}
          sx={{
            backgroundColor: theme.palette.background.paper,
            '&:hover': { backgroundColor: theme.palette.primary.light }
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>

        <Paper
          elevation={3}
          sx={{
            maxWidth: '800px',
            padding: theme.spacing(4),
            margin: '0 auto',
            position: 'relative',
            transition: 'all 0.3s ease-in-out',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <FormatQuoteIcon 
            sx={{ 
              fontSize: 60,
              color: theme.palette.primary.main,
              opacity: 0.2,
              position: 'absolute',
              top: 20,
              left: 20
            }}
          />
          
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <Avatar
              src={testimonials[currentIndex].avatar}
              sx={{ 
                width: 80,
                height: 80,
                marginBottom: 2,
                border: `3px solid ${theme.palette.primary.main}`
              }}
            />
            
            <Rating 
              value={testimonials[currentIndex].rating} 
              readOnly 
              sx={{ marginBottom: 2 }}
            />

            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem',
                fontStyle: 'italic',
                marginBottom: 3,
                color: theme.palette.text.secondary
              }}
            >
              "{testimonials[currentIndex].text}"
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {testimonials[currentIndex].name}
            </Typography>
            
            <Typography variant="subtitle1" color="primary">
              {testimonials[currentIndex].position}
            </Typography>
            
            <Typography variant="subtitle2" color="text.secondary">
              {testimonials[currentIndex].company}
            </Typography>
          </Box>
        </Paper>

        <IconButton 
          onClick={handleNext}
          sx={{
            backgroundColor: theme.palette.background.paper,
            '&:hover': { backgroundColor: theme.palette.primary.light }
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        marginTop: 3,
        gap: 1
      }}>
        {testimonials.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: index === currentIndex ? 
                theme.palette.primary.main : 
                theme.palette.grey[300],
              transition: 'all 0.3s ease-in-out',
              cursor: 'pointer'
            }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Box>
    </Box>
  );
}