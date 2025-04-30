import React from 'react';
import PageLayout from '../LayoutContainers/PageLayout';
import DefaultNavbar from '../Navbars/DefaultNavbar';
import Footer from '../Footer';


import Banner from '../../components/Banner/index.jsx';
// Import additional components
import HeroSection from './components/HeroSection/index';
import FeatureHighlights from './components/FeatureHighlights/index';
import Testimonials from './components/Testemonials/index';
import BlogSection from './components/BlogSection/index';
import FAQSection from './components/FAQSection/index';
import VideoSection from './components/VideoSection/index';
import ContactForm from './components/ContactForm/index';
import SocialMediaLinks from './components/SocialMediaLinks/index';
import InteractiveElements from './components/InteractiveElements/index';
import Map from './components/Map/index';
import Subscribe from './components/Subscribe/index';




export default function Homepage() {
  return (
    <PageLayout>
      <DefaultNavbar />
      <Banner />
      <HeroSection />
      <FeatureHighlights />
      <Testimonials />
      <BlogSection />
      <FAQSection />
      
      
      <Subscribe/>
      <Footer />
    </PageLayout>
  );
}