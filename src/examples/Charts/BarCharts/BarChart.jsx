import React from "react";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";
import { Card } from "@mui/material";
import VuiBox from "@/components/VuiBox";
import VuiTypography from "@/components/VuiTypography";

function BarChart({ title, description, height, chart }) {
  const { data, options } = chart;

  return (
    <Card>
      <VuiBox p={3}>
        <VuiBox mb={1}>
          <VuiTypography variant="lg" color="white" fontWeight="bold">
            {title}
          </VuiTypography>
        </VuiBox>
        <VuiBox mb={2}>
          <VuiTypography variant="button" color="text" fontWeight="regular">
            {description}
          </VuiTypography>
        </VuiBox>
      </VuiBox>
      <VuiBox p={3}>
        <VuiBox height={height}>
          <Chart
            options={options}
            series={data}
            type="bar"
            width="100%"
            height="100%"
          />
        </VuiBox>
      </VuiBox>
    </Card>
  );
}

BarChart.propTypes = {
  chart: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.number)
      })
    ).isRequired,
    options: PropTypes.object.isRequired
  }).isRequired
};

BarChart.defaultProps = {
  chart: {
    data: [],
    options: {},
  },
};

export default BarChart;
