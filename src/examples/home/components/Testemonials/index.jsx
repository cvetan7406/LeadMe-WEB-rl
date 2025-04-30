import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Container, Avatar, Rating, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    rating: 5,
    text: 'This platform has completely transformed how we operate. The efficiency gains and user experience are remarkable.',
    avatar: '👩‍💼',
  },
  {
    name: 'Michael Chen',
    role: 'Lead Developer',
    rating: 5,
    text: 'The attention to detail and technical excellence is outstanding. This is exactly what we needed for our digital transformation.',
    avatar: '👨‍💻',
  },
  {
    name: 'Emma Davis',
    role: 'Marketing Director',
    rating: 5,
    text: 'Incredible user interface and powerful features. Our team productivity has increased significantly since implementation.',
    avatar: '👩‍💼',
  },
];

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

export default function Testimonials() {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (
      prevIndex + newDirection < 0
        ? testimonials.length - 1
        : (prevIndex + newDirection) % testimonials.length
    ));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: 'transparent',
        position: 'relative',
        py: 12,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(33,150,243,0.05) 0%, rgba(33,203,243,0.05) 100%)',
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <MotionTypography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            What Our Clients Say
          </MotionTypography>
          <MotionTypography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Don't just take our word for it - hear from our satisfied customers
          </MotionTypography>
        </Box>

        <Box sx={{ position: 'relative', height: 400, display: 'flex', alignItems: 'center' }}>
          <AnimatePresence initial={false} custom={direction}>
            <MotionBox
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                px: 4,
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: '3rem',
                  mb: 3,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                }}
              >
                {testimonials[currentIndex].avatar}
              </Avatar>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                {testimonials[currentIndex].name}
              </Typography>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                {testimonials[currentIndex].role}
              </Typography>
              <Rating value={testimonials[currentIndex].rating} readOnly sx={{ mb: 2 }} />
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.2rem',
                  maxWidth: '800px',
                  color: 'text.secondary',
                  fontStyle: 'italic',
                }}
              >
                "{testimonials[currentIndex].text}"
              </Typography>
            </MotionBox>
          </AnimatePresence>

          <IconButton
            onClick={() => paginate(-1)}
            sx={{
              position: 'absolute',
              left: 0,
              zIndex: 2,
              color: 'primary.main',
              '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' },
            }}
          >
            <ArrowBack />
          </IconButton>
          <IconButton
            onClick={() => paginate(1)}
            sx={{
              position: 'absolute',
              right: 0,
              zIndex: 2,
              color: 'primary.main',
              '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' },
            }}
          >
            <ArrowForward />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          {testimonials.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 12,
                height: 12,
                mx: 1,
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? 'primary.main' : 'grey.300',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}