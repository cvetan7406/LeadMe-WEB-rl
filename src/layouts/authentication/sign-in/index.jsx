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

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import VuiInput from "../../../components/VuiInput";
import VuiButton from "../../../components/VuiButton";
import VuiSwitch from "../../../components/VuiSwitch";
import CoverLayoutNoNav from "../components/CoverLayoutNoNav";
import AuthUI from "../../../components/AuthUI";

// Images
import bgSignIn from "../../../assets/images/signInImage.png";

function SignIn() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <CoverLayoutNoNav
      title=""
      color=""
      description=""
      image={bgSignIn}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Card sx={{ width: '100%', mx: 'auto' }}>
            <VuiBox px={4} pt={4}>
              <VuiBox mb={2}>
                <VuiTypography
                  color="white"
                  variant="h3"
                  fontWeight="bold"
                  textAlign="center"
                >
                  OmniGate Portal
                </VuiTypography>
              </VuiBox>
            </VuiBox>
            <VuiBox p={1}>
              <VuiBox>
                <AuthUI />
              </VuiBox>
            </VuiBox>
          </Card>
        </Grid>
      </Grid>
    </CoverLayoutNoNav>
  );
}

export default SignIn;
