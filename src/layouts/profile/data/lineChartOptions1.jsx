/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

export const lineChartOptionsProfile1 = {
  chart: {
    height: "85%",
    toolbar: {
      show: false,
    },
    redrawOnParentResize: true,
    title: {
      text: "Energy Consumption",
      align: "left",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#c8cfca"
      }
    }
  },
  tooltip: {
    theme: "dark",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    type: "category",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: {
      show: true,
      style: {
        colors: "#c8cfca",
        fontSize: "12px",
      },
    },
    axisBorder: {
      show: true,
      color: "#56577A"
    },
    axisTicks: {
      show: true,
      color: "#56577A"
    },
  },
  yaxis: {
    show: true,
    title: {
      text: "kWh",
      style: {
        color: "#c8cfca",
        fontSize: "12px"
      }
    },
    labels: {
      show: true,
      style: {
        colors: "#c8cfca",
        fontSize: "12px",
      },
    },
  },
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "right",
    labels: {
      colors: "#c8cfca"
    }
  },
  grid: {
    show: false,
    strokeDashArray: 5,
    borderColor: "#56577A",
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "vertical",
      shadeIntensity: 0,
      gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
      inverseColors: true,
      opacityFrom: 0.8,
      opacityTo: 0,
      stops: [],
    },
    colors: ["#01B574"],
  },
  colors: ["#01B574"],
};
