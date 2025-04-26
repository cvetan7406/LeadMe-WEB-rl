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
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import CoverLayout from "../components/CoverLayout";
import AuthUI from "../../../components/AuthUI";

// Images
import bgSignUp from "../../../assets/images/signUpImage.png";

function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <CoverLayout
      title="Join us today"
      color="white"
      description="Create your account to get started"
      image={bgSignUp}
    >
      <Card>
        <VuiBox px={3} pt={3}>
          <VuiBox mb={1}>
            <VuiTypography
              color="white"
              variant="h3"
              fontWeight="bold"
              textAlign="center"
            >
              Sign Up
            </VuiTypography>
          </VuiBox>
        </VuiBox>
        <VuiBox p={3}>
          <VuiBox>
            <AuthUI />
          </VuiBox>
        </VuiBox>
      </Card>
    </CoverLayout>
  );
}

export default SignUp;
