import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Typography,
  Box,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionTypography = motion(Typography);
const MotionAccordion = motion(Accordion);

const faqs = [
  {
    question: 'What services do you offer?',
    answer: 'We provide comprehensive digital solutions including web development, mobile applications, cloud services, and digital transformation consulting. Our services are tailored to meet your specific business needs and goals.',
  },
  {
    question: 'How do you ensure project security?',
    answer: 'Security is our top priority. We implement industry-standard encryption, regular security audits, and follow best practices for data protection. Our team stays updated with the latest security protocols to ensure your project is protected.',
  },
  {
    question: 'What is your development process?',
    answer: 'Our development process follows an agile methodology with regular client communication and iterations. We begin with thorough requirements gathering, followed by design, development, testing, and deployment phases, ensuring quality at every step.',
  },
  {
    question: 'How do you handle project maintenance?',
    answer: 'We provide comprehensive maintenance packages that include regular updates, performance monitoring, security patches, and technical support. Our team is always available to address any issues and ensure your solution runs smoothly.',
  },
  {
    question: 'What makes your solutions different?',
    answer: 'Our solutions stand out through their innovative design, scalability, and focus on user experience. We combine cutting-edge technology with industry best practices to deliver solutions that drive real business value.',
  },
];

export default function FAQSection() {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: theme.palette.background.paper,
        py: 12,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(33,150,243,0.03) 0%, rgba(33,203,243,0.03) 100%)',
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
            Frequently Asked Questions
          </MotionTypography>
          <MotionTypography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find answers to common questions about our services and solutions
          </MotionTypography>
        </Box>

        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <AnimatePresence>
            {faqs.map((faq, index) => (
              <MotionAccordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{
                  mb: 2,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    margin: theme.spacing(1, 0),
                    boxShadow: theme.shadows[2],
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMore
                      sx={{
                        color: 'primary.main',
                        transform: expanded === `panel${index}` ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s ease',
                      }}
                    />
                  }
                  sx={{
                    '&.Mui-expanded': {
                      minHeight: 64,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: expanded === `panel${index}` ? 'primary.main' : 'text.primary',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 3 }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.7,
                      opacity: expanded === `panel${index}` ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </MotionAccordion>
            ))}
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
}