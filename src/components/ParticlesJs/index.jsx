import React, { useCallback, useId } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';

const ParticlesJs = ({ children, backgroundColor = "transparent", particleColor = "#ffffff", particleCount = 20, speed = 2, ...props }) => {
  const uniqueId = useId();
  
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // Container loaded
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <Particles
        id={`tsparticles-${uniqueId}`}
        init={particlesInit}
        loaded={particlesLoaded}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%'
        }}
        options={{
          fullScreen: { enable: false },
          background: {
            color: {
              value: backgroundColor,
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: particleColor,
            },
            links: {
              color: particleColor,
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: speed,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: particleCount,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
          ...props
        }}
      />
      {children}
    </div>
  );
};

export default ParticlesJs;