import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Card } from "@mui/material";
import Chart from "react-apexcharts";
import VuiBox from "@/components/VuiBox";
import VuiTypography from "@/components/VuiTypography";
import colors from "@/assets/theme/base/colors";

function LineChart({ title, description, chart, height }) {
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
      {useMemo(
        () => (
          <VuiBox p={2}>
            <VuiBox height={height}>
              <Chart
                options={options}
                series={data}
                type="line"
                width="100%"
                height="100%"
              />
            </VuiBox>
          </VuiBox>
        ),
        [chart, height]
      )}
    </Card>
  );
}

// Adding PropTypes for better development experience
LineChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  height: PropTypes.string,
  chart: PropTypes.shape({
    data: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired
  }).isRequired
};

// Default props
LineChart.defaultProps = {
  title: "",
  description: "",
  height: "100%"
};

export default LineChart; 