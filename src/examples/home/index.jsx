import React from 'react';
import { Box } from '@mui/material';
import PageLayout from '../LayoutContainers/PageLayout';
import DefaultNavbar from '../Navbars/DefaultNavbar';
import Footer from '../Footer';

// Import components
import HeroSection from './components/HeroSection/index';
import FeatureHighlights from './components/FeatureHighlights/index';
import Testimonials from './components/Testemonials/index';
import BlogSection from './components/BlogSection/index';
import FAQSection from './components/FAQSection/index';
import VideoSection from './components/VideoSection/index';
import ContactForm from './components/ContactForm/index';
import SocialMediaLinks from './components/SocialMediaLinks/index';
import Subscribe from './components/Subscribe/index';
import Map from './components/Map/index';

export default function Homepage() {
  return (
    <PageLayout>
      <DefaultNavbar />
      
      <Box 
        component="main"
        sx={{ 
          scrollBehavior: 'smooth',
          '& > section': {
            scrollMarginTop: '64px', // Height of navbar
          },
          '& > section:not(:first-child)': {
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '1200px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)',
              zIndex: 1
            }
          }
        }}
      >
        {/* Main hero section with particle background */}
        <section id="hero">
          <HeroSection />
        </section>

        {/* Key features with animated cards */}
        <section id="features">
          <FeatureHighlights />
        </section>

        {/* Customer testimonials carousel */}
        <section id="testimonials">
          <Testimonials />
        </section>

        {/* Product showcase video */}
        <section id="video">
          <VideoSection />
        </section>

        {/* Blog and resources */}
        <section id="blog">
          <BlogSection />
        </section>

        {/* FAQ accordion */}
        <section id="faq">
          <FAQSection />
        </section>

        {/* Contact and location sections */}
        <Box 
          component="section" 
          id="contact"
          sx={{
            background: 'linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '200px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.02) 100%)',
              pointerEvents: 'none'
            }
          }}
        >
          <ContactForm />
          <Map />
          <SocialMediaLinks />
          <Subscribe />
        </Box>
      </Box>

      <Footer />
    </PageLayout>
  );
}