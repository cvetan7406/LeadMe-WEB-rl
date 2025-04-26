import React from 'react';
import VuiTypography from '../VuiTypography';
import VuiButton from '../VuiButton';

function VideoBanner() {
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 90px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @media (max-width: 1379px) {
          .video-container {
            background-image: url('https://expo.dev/static/home/signup-stripes.svg');
            background-size: cover;
            background-position: center;
            position: relative;
          }
          .video-container::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 3;
          }
          iframe {
            display: none;
          }
        }
      `}</style>
      <div style={{
        width: '100%', 
        overflow: 'hidden', 
        position: 'relative', 
        paddingTop: '56.25%', // 16:9 Aspect Ratio
        height: '100vh', // Ensures the container covers the full viewport height
      }}>
        <iframe
          style={{
            zIndex: 2,
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%'
          }}
          src="https://www.youtube.com/embed/t7ReU_Pz4bk?autoplay=1&mute=1&controls=0&vq=hd1080&loop=1&fs=0&controls=0"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <div className="video-container" style={{
          position: 'absolute',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2
        }}>
          {/* <BackgroundSVG /> */}
        </div>
        <div style={{
        
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          animation: 'fadeInUp 0.9s ease-out forwards',
          padding: '20px'
        }}>
          <VuiTypography variant="h1" color="white" style={{
            textShadow: '2px 2px 8px rgba(0,0,0,0.6)'
          }}>
            THE POWER TO DO MORE
          </VuiTypography>
          <VuiTypography variant="h5" color="white" style={{
            marginTop: '20px'
          }}>
            Already have access? Click below.
          </VuiTypography>
          <VuiButton color="warning" href="/authentication/sign-in" style={{
            marginTop: '40px',
            
          }}>
            EARLY ACCESS
          </VuiButton>
        </div>
      </div>
    </>
  );
}

export default VideoBanner;
