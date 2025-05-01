import React from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Avatar,
  Chip
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function BlogSection() {
  const theme = useTheme();

  const blogPosts = [
    {
      title: "AI-Driven Insights Transform Call Center Operations",
      excerpt: "Discover how artificial intelligence is revolutionizing customer service and improving agent performance.",
      image: "/1.png",
      category: "Industry Trends",
      author: {
        name: "Alex Thompson",
        avatar: "/1.png"
      },
      date: "April 28, 2024"
    },
    {
      title: "Success Story: 40% Efficiency Boost in 3 Months",
      excerpt: "Learn how a leading telecom provider transformed their operations using our AI-powered solution.",
      image: "/1.png",
      category: "Case Study",
      author: {
        name: "Sarah Chen",
        avatar: "/1.png"
      },
      date: "April 25, 2024"
    },
    {
      title: "New Features: Advanced Analytics Dashboard",
      excerpt: "Explore our latest platform updates including real-time performance metrics and AI recommendations.",
      image: "/1.png",
      category: "Product Update",
      author: {
        name: "Mike Roberts",
        avatar: "/1.png"
      },
      date: "April 22, 2024"
    }
  ];

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[100],
        padding: theme.spacing(10, 3),
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
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Latest Insights
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
            Stay updated with industry trends and platform news
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {blogPosts.map((post, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: theme.shadows[10],
                    '& .blog-image': {
                      transform: 'scale(1.1)',
                    }
                  }
                }}
              >
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt={post.title}
                    className="blog-image"
                    sx={{
                      transition: 'transform 0.3s ease-in-out'
                    }}
                  />
                  <Chip
                    label={post.category}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: theme.palette.primary.main,
                      fontWeight: 600
                    }}
                  />
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '1.25rem',
                      minHeight: '3rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {post.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {post.excerpt}
                  </Typography>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 'auto'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        src={post.author.avatar}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {post.author.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {post.date}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Button 
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ 
                        minWidth: 'auto',
                        p: 1,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          '& .MuiSvgIcon-root': {
                            transform: 'translateX(4px)'
                          }
                        },
                        '& .MuiSvgIcon-root': {
                          transition: 'transform 0.3s ease-in-out'
                        }
                      }}
                    >
                      Read
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            View All Articles
          </Button>
        </Box>
      </Container>
    </Box>
  );
}