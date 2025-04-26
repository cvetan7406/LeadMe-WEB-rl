import React, { useState, useEffect } from 'react';
import PageLayout from '../LayoutContainers/PageLayout';
import DefaultNavbar from '../Navbars/DefaultNavbar';
import Footer from '../Footer';
import VuiBox from '../../components/VuiBox';
import VuiTypography from '../../components/VuiTypography';
import VuiButton from '../../components/VuiButton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import VideoBanner from '../../components/Banner/index';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LanguageIcon from '@mui/icons-material/Language';
import DevicesIcon from '@mui/icons-material/Devices';
import InsightsIcon from '@mui/icons-material/Insights';
import { BsLightningChargeFill, BsGraphUp, BsChatSquareTextFill } from 'react-icons/bs';

// Styled components
const AnimatedCard = styled(motion.div)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  '& svg': {
    marginRight: '10px',
    color: '#0075ff',
  },
}));

const SectionTitle = styled(VuiTypography)(({ theme }) => ({
  position: 'relative',
  marginBottom: '30px',
  paddingBottom: '15px',
  borderBottom: '3px solid #0075ff',
  display: 'inline-block'
}));

const SectionDivider = styled(Divider)(({ theme }) => ({
  margin: '40px 0',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
}));

export default function AboutUs() {
  const [expandedCards, setExpandedCards] = useState({});
  const [hoveredTeamMember, setHoveredTeamMember] = useState(null);

  const toggleCardExpansion = (section, index) => {
    setExpandedCards(prev => ({
      ...prev,
      [`${section}-${index}`]: !prev[`${section}-${index}`]
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Value proposition data with Material UI icons
  const valueProps = [
    {
      icon: <SmartToyIcon sx={{ fontSize: 40 }} />,
      text: 'AI-powered communication & automation',
      color: '#0075ff'
    },
    {
      icon: <FeedbackIcon sx={{ fontSize: 40 }} />,
      text: 'Real-time, actionable customer feedback',
      color: '#00bfff'
    },
    {
      icon: <LanguageIcon sx={{ fontSize: 40 }} />,
      text: 'Customizable & multilingual survey tools',
      color: '#00d68f'
    },
    {
      icon: <DevicesIcon sx={{ fontSize: 40 }} />,
      text: 'Omnichannel and cross-platform reach',
      color: '#ffb300'
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 40 }} />,
      text: 'Data-driven insights for better decisions',
      color: '#ff5b5b'
    }
  ];

  // Benefits data with icons
  const benefits = [
    { 
      icon: <BsChatSquareTextFill size={24} />, 
      title: 'Enhanced Customer Engagement', 
      text: 'Provides timely and relevant interactions, leading to increased customer satisfaction and loyalty.',
      details: 'Our platform uses AI to analyze customer behavior and preferences, enabling personalized communication that resonates with each individual. This leads to higher engagement rates, improved customer satisfaction scores, and increased brand loyalty over time.'
    },
    { 
      icon: <BsLightningChargeFill size={24} />, 
      title: 'Operational Efficiency', 
      text: 'Automates routine inquiries and tasks, freeing human agents to focus on more complex issues.',
      details: 'By automating up to 70% of routine customer interactions, your team can focus on high-value activities that require human touch. Our analytics show this typically results in 30-40% cost savings while improving response times by up to 80%.'
    },
    { 
      icon: <BsGraphUp size={24} />, 
      title: 'Data-Driven Insights', 
      text: 'Collects and analyzes customer interaction data, offering valuable insights to inform business strategies and improve services.',
      details: 'Our advanced analytics engine processes millions of customer interactions to identify trends, sentiment patterns, and improvement opportunities. These actionable insights help you make informed decisions about product development, service improvements, and marketing strategies.'
    }
  ];

  // Team members data
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      bio: 'With over 15 years of experience in customer engagement solutions, Alex founded Lead Vision to revolutionize how businesses connect with their customers.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      bio: 'Sarah brings her expertise in AI and machine learning to develop the cutting-edge technology that powers the Lead Me platform.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Customer Success',
      bio: 'Michael ensures that every client gets the most value from the Lead Me platform through personalized onboarding and ongoing support.',
      image: 'https://randomuser.me/api/portraits/men/67.jpg'
    }
  ];

  return (
    <PageLayout>
      <DefaultNavbar />
      <VideoBanner />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Box sx={{ padding: '20px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {/* Executive Summary Section */}
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <Grid container spacing={0} mb={4}>
              <Grid item xs={12}>
                <VuiBox
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '10px',
                    padding: '40px',
                    width: '100%',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  <SectionTitle variant="h4" color="white" gutterBottom>
                    Executive Summary – Lead Me Platform
                  </SectionTitle>
                  <VuiTypography variant="body1" color="white">
                    Lead Me, developed by Lead Vision, is a next-generation AI-powered communication and customer feedback platform designed to transform the way businesses interact with their clients. With its focus on intelligent automation, real-time engagement, and actionable insights, Lead Me empowers organizations to elevate customer satisfaction, streamline operations, and drive measurable results.
                  </VuiTypography>
                </VuiBox>
              </Grid>
            </Grid>
          </motion.div>

          <SectionDivider />

          {/* Mission Statement */}
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <Grid container spacing={0} mb={4}>
              <Grid item xs={12}>
                <VuiBox
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '10px',
                    padding: '40px',
                    width: '100%',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      boxShadow: '0 5px 15px rgba(0, 117, 255, 0.2)'
                    }
                  }}
                >
                  <VuiTypography variant="h5" color="white" gutterBottom>
                    Our Mission
                  </VuiTypography>
                  <VuiTypography
                    variant="body1"
                    color="white"
                    fontStyle="italic"
                    sx={{
                      width: '100%',
                      margin: '0 auto',
                      fontSize: '1.2rem',
                      padding: '20px'
                    }}
                  >
                    "To empower businesses with intelligent communication tools that create meaningful connections with customers and drive growth through actionable insights."
                  </VuiTypography>
                </VuiBox>
              </Grid>
            </Grid>
          </motion.div>

          <SectionDivider />

          {/* Key Value Propositions */}
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <Grid container spacing={0} mb={4}>
              <Grid item xs={12}>
                <VuiBox sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '10px',
                  padding: '40px',
                  width: '100%'
                }}>
                  <SectionTitle variant="h4" color="white" gutterBottom>
                    Key Value Propositions
                  </SectionTitle>
                  
                  {/* First row - 3 cards */}
                  <Grid container spacing={3} mb={3}>
                    {valueProps.slice(0, 3).map((prop, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <AnimatedCard
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Card
                            sx={{
                              backgroundColor: 'rgba(20, 20, 20, 0.8)',
                              height: '100%',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                boxShadow: `0 8px 16px ${prop.color}40`
                              }
                            }}
                          >
                            <CardContent sx={{ textAlign: 'center', padding: '24px' }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  width: '70px',
                                  height: '70px',
                                  borderRadius: '50%',
                                  backgroundColor: `${prop.color}20`,
                                  margin: '0 auto 16px',
                                  transition: 'all 0.3s ease',
                                  '& svg': {
                                    color: prop.color,
                                    transition: 'transform 0.3s ease'
                                  },
                                  '&:hover': {
                                    backgroundColor: `${prop.color}30`,
                                    '& svg': {
                                      transform: 'scale(1.2)'
                                    }
                                  }
                                }}
                              >
                                {prop.icon}
                              </Box>
                              <VuiTypography variant="h6" color="white" gutterBottom>
                                {prop.text}
                              </VuiTypography>
                            </CardContent>
                          </Card>
                        </AnimatedCard>
                      </Grid>
                    ))}
                  </Grid>
                  
                  {/* Second row - 2 cards centered */}
                  <Grid container spacing={3} justifyContent="center">
                    {valueProps.slice(3, 5).map((prop, index) => (
                      <Grid item xs={12} md={5} key={index + 3}>
                        <AnimatedCard
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Card
                            sx={{
                              backgroundColor: 'rgba(20, 20, 20, 0.8)',
                              height: '100%',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                boxShadow: `0 8px 16px ${prop.color}40`
                              }
                            }}
                          >
                            <CardContent sx={{ textAlign: 'center', padding: '24px' }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  width: '70px',
                                  height: '70px',
                                  borderRadius: '50%',
                                  backgroundColor: `${prop.color}20`,
                                  margin: '0 auto 16px',
                                  transition: 'all 0.3s ease',
                                  '& svg': {
                                    color: prop.color,
                                    transition: 'transform 0.3s ease'
                                  },
                                  '&:hover': {
                                    backgroundColor: `${prop.color}30`,
                                    '& svg': {
                                      transform: 'scale(1.2)'
                                    }
                                  }
                                }}
                              >
                                {prop.icon}
                              </Box>
                              <VuiTypography variant="h6" color="white" gutterBottom>
                                {prop.text}
                              </VuiTypography>
                            </CardContent>
                          </Card>
                        </AnimatedCard>
                      </Grid>
                    ))}
                  </Grid>
                </VuiBox>
              </Grid>
            </Grid>
          </motion.div>

          <SectionDivider />

          {/* Benefits for Businesses */}
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <Grid container spacing={0} mb={4}>
              <Grid item xs={12}>
                <VuiBox sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '10px',
                  padding: '40px',
                  width: '100%'
                }}>
                  <SectionTitle variant="h4" color="white" gutterBottom>
                    Benefits for Businesses
                  </SectionTitle>
                  <Grid container spacing={3} direction="column">
                    {benefits.map((benefit, index) => (
                      <Grid item xs={12} key={index} sx={{ mb: 2 }}>
                        <AnimatedCard
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          style={{ width: '100%' }}
                        >
                          <Card
                            sx={{
                              backgroundColor: 'rgba(20, 20, 20, 0.8)',
                              width: '100%',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              transform: expandedCards[`benefits-${index}`] ? 'scale(1.01)' : 'scale(1)',
                              boxShadow: expandedCards[`benefits-${index}`] ? '0 8px 16px rgba(0,117,255,0.3)' : 'none'
                            }}
                            onClick={() => toggleCardExpansion('benefits', index)}
                          >
                            <CardContent sx={{ padding: '24px' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(0, 117, 255, 0.1)',
                                    marginRight: '16px',
                                    '& svg': {
                                      color: '#0075ff',
                                      fontSize: '24px'
                                    }
                                  }}
                                >
                                  {benefit.icon}
                                </Box>
                                <VuiTypography variant="h5" color="white">
                                  {benefit.title}
                                </VuiTypography>
                              </Box>
                              
                              <VuiTypography variant="body2" color="white" mt={2} ml={8}>
                                {benefit.text}
                              </VuiTypography>
                              
                              {expandedCards[`benefits-${index}`] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <VuiBox mt={2} p={3} ml={8} sx={{ backgroundColor: 'rgba(0, 117, 255, 0.1)', borderRadius: '5px' }}>
                                    <VuiTypography variant="body2" color="white">
                                      {benefit.details}
                                    </VuiTypography>
                                  </VuiBox>
                                </motion.div>
                              )}
                            </CardContent>
                          </Card>
                        </AnimatedCard>
                      </Grid>
                    ))}
                  </Grid>
                </VuiBox>
              </Grid>
            </Grid>
          </motion.div>

          <SectionDivider />

          {/* Meet Our Team */}
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <Grid container spacing={0} mb={4}>
              <Grid item xs={12}>
                <VuiBox sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '10px',
                  padding: '40px',
                  width: '100%'
                }}>
                  <SectionTitle variant="h4" color="white" gutterBottom>
                    Meet Our Team
                  </SectionTitle>
                  <Grid container spacing={3} direction="column">
                    {teamMembers.map((member, index) => (
                      <Grid item xs={12} key={index} sx={{ mb: 2 }}>
                        <AnimatedCard
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          style={{ width: '100%' }}
                          onHoverStart={() => setHoveredTeamMember(index)}
                          onHoverEnd={() => setHoveredTeamMember(null)}
                        >
                          <Card sx={{
                            backgroundColor: 'rgba(20, 20, 20, 0.8)',
                            width: '100%',
                            position: 'relative',
                            overflow: 'hidden'
                          }}>
                            <CardContent sx={{ padding: '24px' }}>
                              <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ textAlign: 'center' }}>
                                {/* Left side - Image */}
                                <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                                  <Box
                                    component="img"
                                    src={member.image}
                                    sx={{
                                      width: 150,
                                      height: 150,
                                      borderRadius: '50%',
                                      border: '3px solid #0075ff',
                                      transition: 'all 0.3s ease',
                                      transform: hoveredTeamMember === index ? 'scale(1.05)' : 'scale(1)'
                                    }}
                                  />
                                </Grid>
                                
                                {/* Right side - Text content */}
                                <Grid item xs={12} md={9}>
                                  <VuiTypography variant="h5" color="white" sx={{ textAlign: 'center' }}>
                                    {member.name}
                                  </VuiTypography>
                                  <VuiTypography variant="subtitle1" color="primary" mb={2} sx={{ textAlign: 'center' }}>
                                    {member.role}
                                  </VuiTypography>
                                  <VuiTypography variant="body2" color="white" sx={{ textAlign: 'center' }}>
                                    {member.bio}
                                  </VuiTypography>
                                  
                                  {/* Social media icons */}
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      gap: '10px',
                                      mt: 2
                                    }}
                                  >
                                    {['LinkedIn', 'Twitter', 'Email'].map((social, idx) => (
                                      <Box
                                        key={idx}
                                        sx={{
                                          width: '36px',
                                          height: '36px',
                                          borderRadius: '50%',
                                          backgroundColor: '#0075ff',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          cursor: 'pointer',
                                          transition: 'all 0.3s ease',
                                          '&:hover': {
                                            backgroundColor: '#0056b3',
                                            transform: 'translateY(-3px)'
                                          }
                                        }}
                                      >
                                        <VuiTypography variant="button" color="white">
                                          {social[0]}
                                        </VuiTypography>
                                      </Box>
                                    ))}
                                  </Box>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </AnimatedCard>
                      </Grid>
                    ))}
                  </Grid>
                </VuiBox>
              </Grid>
            </Grid>
          </motion.div>
        </Box>
      </motion.div>

      <Footer />
    </PageLayout>
  );
}