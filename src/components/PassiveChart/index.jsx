import React, { useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';

const PassiveChart = (props) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const addPassiveListeners = () => {
      const chartElement = chartRef.current?.chart?.el;
      if (chartElement) {
        const elements = chartElement.getElementsByTagName('*');
        const eventListenerOptions = { passive: true };

        // Add passive listeners to all touch events
        ['touchstart', 'touchmove', 'touchend'].forEach(eventName => {
          chartElement.addEventListener(eventName, () => {}, eventListenerOptions);
          Array.from(elements).forEach(element => {
            element.addEventListener(eventName, () => {}, eventListenerOptions);
          });
        });
      }
    };

    // Wait for chart to be rendered
    setTimeout(addPassiveListeners, 100);
  }, []);

  return (
    <ReactApexChart
      ref={chartRef}
      {...props}
    />
  );
};

PassiveChart.propTypes = {
  // All ApexCharts props are passed through
  type: PropTypes.string.isRequired,
  series: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default PassiveChart; 