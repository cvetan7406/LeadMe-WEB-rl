import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  Typography, 
  Box, 
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQSection() {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      question: "How does the AI-powered call analysis work?",
      answer: "Our AI system analyzes call patterns, customer sentiment, and conversation flow in real-time. It provides instant insights and suggestions to improve call quality and customer satisfaction."
    },
    {
      question: "What type of reporting and analytics do you offer?",
      answer: "We provide comprehensive analytics including call success rates, campaign performance metrics, agent productivity stats, and customer engagement insights. All data is available through customizable dashboards."
    },
    {
      question: "How secure is your platform?",
      answer: "We implement bank-grade security measures including end-to-end encryption, secure data storage, and regular security audits. We're compliant with industry standards and data protection regulations."
    },
    {
      question: "Can I integrate with my existing CRM?",
      answer: "Yes, our platform offers seamless integration with major CRM systems. We provide APIs and pre-built connectors for popular platforms to ensure smooth data flow."
    },
    {
      question: "What kind of customer support do you provide?",
      answer: "We offer 24/7 technical support, dedicated account managers, and regular training sessions. Our team is always available to help you maximize the platform's potential."
    },
    {
      question: "How do you handle call recording and storage?",
      answer: "All calls are automatically recorded and stored securely in the cloud. You can access recordings anytime, and we maintain backups according to your retention policy requirements."
    }
  ];

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
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
            Frequently Asked Questions
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
            Everything you need to know about our call center solution
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={10}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                sx={{
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '8px !important',
                  mb: 2,
                  '&:not(:last-child)': {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  },
                  '&.Mui-expanded': {
                    margin: theme.spacing(1, 0),
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon 
                      sx={{ 
                        color: theme.palette.primary.main,
                        transition: 'all 0.3s ease-in-out',
                        transform: expanded === `panel${index}` ? 'rotate(180deg)' : 'rotate(0deg)'
                      }} 
                    />
                  }
                  sx={{
                    padding: theme.spacing(2),
                    '&.Mui-expanded': {
                      minHeight: 'auto',
                    }
                  }}
                >
                  <Typography 
                    variant="h6"
                    sx={{ 
                      fontWeight: 600,
                      color: expanded === `panel${index}` ? theme.palette.primary.main : 'inherit'
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    padding: theme.spacing(2),
                    borderTop: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Typography 
                    variant="body1"
                    sx={{ 
                      color: theme.palette.text.secondary,
                      lineHeight: 1.6
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}