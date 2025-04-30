import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Container, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowForward } from '@mui/icons-material';

const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

const blogPosts = [
  {
    title: 'The Future of Digital Innovation',
    description: 'Explore the latest trends and technologies shaping the digital landscape.',
    image: 'https://source.unsplash.com/random/800x600?tech',
    date: 'April 25, 2025',
    readTime: '5 min read',
  },
  {
    title: 'Maximizing Business Growth',
    description: 'Learn strategies to accelerate your business growth in the digital age.',
    image: 'https://source.unsplash.com/random/800x600?business',
    date: 'April 23, 2025',
    readTime: '4 min read',
  },
  {
    title: 'Building Scalable Solutions',
    description: 'Best practices for creating scalable and maintainable digital solutions.',
    image: 'https://source.unsplash.com/random/800x600?coding',
    date: 'April 20, 2025',
    readTime: '6 min read',
  },
];

export default function BlogSection() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: theme.palette.background.default,
        py: 12,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(33,150,243,0.02) 0%, rgba(33,203,243,0.02) 100%)',
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
            Latest Insights
          </MotionTypography>
          <MotionTypography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Stay updated with our latest articles, trends, and industry insights
          </MotionTypography>
        </Box>

        <Grid container spacing={4}>
          {blogPosts.map((post, index) => (
            <Grid item xs={12} md={4} key={post.title}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: theme.shadows[8],
                }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={post.image}
                  alt={post.title}
                  sx={{
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{ fontWeight: 500 }}
                    >
                      {post.date} · {post.readTime}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {post.description}
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    endIcon={<ArrowForward />}
                    sx={{
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              px: 4,
              py: 1.5,
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            View All Articles
          </Button>
        </Box>
      </Container>
    </Box>
  );
}