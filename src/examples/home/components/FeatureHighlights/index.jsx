import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Typography,
  Box,
  Grid,
  Container,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  MobileStepper,
  Chip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayArrow as PlayIcon,
  Send as SendIcon,
  OpenInNew as OpenInNewIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const articles = [
  {
    title: 'The Future of Digital Innovation',
    subtitle: 'Explore the latest trends and technologies shaping the digital landscape.',
    date: 'April 25, 2025',
    readTime: '5 min read',
    image: '/path/to/digital-innovation.jpg',
    gradient: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)'
  },
  {
    title: 'Maximizing Business Growth',
    subtitle: 'Learn strategies to accelerate your business growth in the digital age.',
    date: 'April 23, 2025',
    readTime: '4 min read',
    image: '/path/to/business-growth.jpg',
    gradient: 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)'
  },
  {
    title: 'Building Scalable Solutions',
    subtitle: 'Best practices for creating scalable and maintainable digital solutions.',
    date: 'April 20, 2025',
    readTime: '6 min read',
    image: '/path/to/scalable-solutions.jpg',
    gradient: 'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)'
  }
];

const interactiveFeatures = [
  {
    title: 'Real-time Analytics',
    description: 'Track your performance with our advanced analytics dashboard.',
    gradient: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)'
  },
  {
    title: 'Smart Automation',
    description: 'Automate your workflow with intelligent AI-powered tools.',
    gradient: 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)'
  },
  {
    title: 'Secure Platform',
    description: 'Enterprise-grade security with end-to-end encryption.',
    gradient: 'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)'
  }
];

export default function FeatureHighlights() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isMapHovered, setIsMapHovered] = useState(false);

  const maxSteps = articles.length;

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const handleVideoPlay = () => {
    setIsVideoLoading(true);
    setIsVideoPlaying(true);
    setTimeout(() => setIsVideoLoading(false), 1500);
  };

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: theme.palette.background.default,
        py: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        {/* Video Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ mb: 12 }}
        >
          <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Watch Our Story
          </Typography>
          <Paper
            elevation={8}
            sx={{
              position: 'relative',
              height: '500px',
              overflow: 'hidden',
              borderRadius: '16px',
              cursor: 'pointer',
              '&:hover .play-button': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <Box
              component="img"
              src="/path/to/video-thumbnail.jpg"
              alt="Video thumbnail"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isVideoPlaying ? 'none' : 'brightness(0.7)',
                transition: 'filter 0.3s ease',
              }}
            />
            <AnimatePresence>
              {!isVideoPlaying && !isVideoLoading && (
                <MotionBox
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="play-button"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <IconButton
                    aria-label="Play video"
                    onClick={handleVideoPlay}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      width: '80px',
                      height: '80px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'white',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <PlayIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </MotionBox>
              )}
            </AnimatePresence>
            {isVideoLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <CircularProgress size={60} />
              </Box>
            )}
          </Paper>
        </MotionBox>

        {/* Latest Insights Carousel */}
        <Box sx={{ mb: 12 }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Latest Insights
          </Typography>
          <Typography 
            variant="h5" 
            align="center" 
            sx={{ 
              mb: 6, 
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Stay updated with our latest articles, trends, and industry insights
          </Typography>
          <Box sx={{ position: 'relative', width: '100%', height: 'auto' }}>
            <AnimatePresence mode="wait">
              <MotionBox
                key={activeStep}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    background: articles[activeStep].gradient,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <Box
                        component="img"
                        src={articles[activeStep].image}
                        alt={articles[activeStep].title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          minHeight: { xs: '300px', md: '400px' },
                          objectFit: 'cover',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                            {articles[activeStep].date}
                          </Typography>
                          <Box sx={{ width: '4px', height: '4px', borderRadius: '50%', bgcolor: 'white', opacity: 0.8 }} />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, color: 'white', opacity: 0.8 }} />
                            <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                              {articles[activeStep].readTime}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="h3" color="white" gutterBottom sx={{ fontWeight: 700 }}>
                          {articles[activeStep].title}
                        </Typography>
                        <Typography variant="h6" color="white" sx={{ opacity: 0.9, mb: 4 }}>
                          {articles[activeStep].subtitle}
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{
                            mt: 'auto',
                            bgcolor: 'white',
                            color: 'text.primary',
                            '&:hover': {
                              bgcolor: 'grey.100',
                            },
                          }}
                        >
                          Read More
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </MotionBox>
            </AnimatePresence>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2,
              }}
            >
              <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                sx={{
                  background: 'transparent',
                  '& .MuiMobileStepper-dot': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    width: '8px',
                    height: '8px',
                    margin: '0 4px',
                  },
                  '& .MuiMobileStepper-dotActive': {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
                nextButton={
                  <IconButton onClick={handleNext}>
                    <KeyboardArrowRight />
                  </IconButton>
                }
                backButton={
                  <IconButton onClick={handleBack}>
                    <KeyboardArrowLeft />
                  </IconButton>
                }
              />
            </Box>
          </Box>
        </Box>

        {/* Interactive Features */}
        <Box sx={{ mb: 12 }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Interactive Features
          </Typography>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 4,
              width: '100%',
              mt: 4
            }}
          >
            {interactiveFeatures.map((feature, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                sx={{
                  height: '100%',
                  background: feature.gradient,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                }}
              >
                <CardContent sx={{ p: 4, color: 'white' }}>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1">
                    {feature.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            ))}
          </Box>
        </Box>

        {/* Contact Form and Map */}
        <Box sx={{ mb: 12 }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box component="form" noValidate>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    name="name"
                    value={formData.name}
                    variant="outlined"
                    required
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    variant="outlined"
                    required
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Message"
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    variant="outlined"
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)',
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                onMouseEnter={() => setIsMapHovered(true)}
                onMouseLeave={() => setIsMapHovered(false)}
              >
                <Card 
                  sx={{ 
                    height: '100%', 
                    minHeight: 400, 
                    borderRadius: '16px',
                    transform: isMapHovered ? 'scale(1.02)' : 'scale(1)',
                    transition: 'transform 0.3s ease',
                    position: 'relative',
                  }}
                >
                  <iframe
                    title="location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.2922926156740993!3d48.858370079287466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sEiffel%20Tower!5e0!3m2!1sen!2sus!4v1621859476051!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  />
                  {isMapHovered && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <OpenInNewIcon />
                      <Typography>Open in Google Maps</Typography>
                    </Box>
                  )}
                </Card>
              </MotionBox>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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
