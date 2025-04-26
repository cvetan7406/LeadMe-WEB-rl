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

import { Card, Stack } from "@mui/material";
// @mui material components
import Grid from "@mui/material/Grid";
import colors from "../../assets/theme/base/colors";

// Vision UI Dashboard React base styles
import linearGradient from "../../assets/theme/functions/linearGradient";

// Vision UI Dashboard React components
import VuiBox from "../../components/VuiBox";
import VuiProgress from "../../components/VuiProgress";
import VuiTypography from "../../components/VuiTypography";
import VuiButton from "../../components/VuiButton";

// Vision UI Dashboard React contexts
import { setDirection, useVisionUIController } from "../../context";
import MiniStatisticsCard from "../../examples/Cards/StatisticsCards/MiniStatisticsCard";
import BarChart from "../../examples/Charts/BarCharts/BarChart.jsx";

// Data
import LineChart from "../../examples/Charts/LineCharts/LineChart";
import Footer from "../../examples/Footer";

// Vision UI Dashboard React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import OrderOverview from "../../layouts/rtl/components/OrderOverview";
import Projects from "../../layouts/rtl/components/Projects";
import ReferralTracking from "../../layouts/rtl/components/ReferralTracking";
import SatisfactionRate from "../../layouts/rtl/components/SatisfactionRate";

// Dashboard layout components
import WelcomeMark from "../../layouts/rtl/components/WelcomeMark";
import { barChartDataDashboard } from "../../layouts/rtl/data/barChartData";
import { barChartOptionsDashboard } from "../../layouts/rtl/data/barChartOptions";
import { lineChartDataDashboard } from "../../layouts/rtl/data/lineChartData";
import { lineChartOptionsDashboard } from "../../layouts/rtl/data/lineChartOptions";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

// React icons
import { IoIosRocket } from "react-icons/io";
import { IoBuild, IoDocumentText, IoGlobe, IoWallet } from "react-icons/io5";
import * as XLSX from 'xlsx';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          selectedFile.type === "application/vnd.ms-excel") {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please upload only Excel files (.xlsx or .xls)");
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          setFileData(jsonData);
          setError(null);
        } catch (error) {
          setError("Error processing the Excel file");
          console.error("Excel processing error:", error);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      setError("Error reading the file");
      console.error("File reading error:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <VuiBox p={3}>
                <VuiTypography variant="h5" color="white" fontWeight="bold" mb="10px">
                  Excel File Upload
                </VuiTypography>
                <VuiTypography variant="button" color="text" fontWeight="regular" mb="20px">
                  Upload your Excel file (.xlsx or .xls) to process the data
                </VuiTypography>

                <VuiBox 
                  border="2px dashed"
                  borderColor="info.main"
                  borderRadius="lg"
                  p={4}
                  mb={3}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.8 },
                    transition: 'opacity 0.2s ease-in-out'
                  }}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <input
                    type="file"
                    id="file-input"
                    accept=".xlsx,.xls"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <Stack spacing={1} alignItems="center">
                    <VuiTypography variant="h6" color="white">
                      Drag and drop your file here or click to browse
                    </VuiTypography>
                    {file && (
                      <VuiTypography variant="button" color="success">
                        Selected file: {file.name}
                      </VuiTypography>
                    )}
                    {error && (
                      <VuiTypography variant="button" color="error">
                        {error}
                      </VuiTypography>
                    )}
                  </Stack>
                </VuiBox>

                <VuiButton
                  color="info"
                  variant="contained"
                  onClick={handleUpload}
                  disabled={!file}
                  fullWidth
                >
                  Upload and Process File
                </VuiButton>

                {fileData && (
                  <VuiBox mt={3}>
                    <VuiTypography variant="h6" color="white" mb={2}>
                      Processed Data Preview
                    </VuiTypography>
                    <VuiBox
                      sx={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: '10px',
                        p: 2
                      }}
                    >
                      <pre style={{ color: 'white', margin: 0 }}>
                        {JSON.stringify(fileData, null, 2)}
                      </pre>
                    </VuiBox>
                  </VuiBox>
                )}
              </VuiBox>
            </Card>
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default FileUpload;
