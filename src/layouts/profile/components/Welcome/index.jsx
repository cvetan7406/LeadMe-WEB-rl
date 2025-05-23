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

import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Icon } from "@mui/material";
import welcome from "../../../../assets/images/welcome-profile.png";
import VuiTypography from "../../../../components/VuiTypography/index";
import VuiBox from "../../../../components/VuiBox/index";

const Welcome = ({ email = 'Not available', role = 'user' }) => {
  const navigate = useNavigate();

  const handleProfileSettings = () => {
    navigate('/profile/settings');
  };
  return (
    <Card
      sx={({ breakpoints }) => ({
        background: `url(${welcome})`,
        backgroundSize: "cover",
        borderRadius: "20px",
        height: "100%",
        [breakpoints.only("xl")]: {
          gridArea: "1 / 1 / 2 / 2",
        },
      })}
    >
      <VuiBox display="flex" flexDirection="column" sx={{ height: "100%" }}>
        <VuiBox display="flex" flexDirection="column" mb="auto">
          <VuiTypography color="white" variant="h3" fontWeight="bold" mb="3px">
            Welcome to Dashboard
          </VuiTypography>
          <VuiTypography color="white" variant="button" fontWeight="regular">
            {email} • {role}
          </VuiTypography>
        </VuiBox>
        <VuiBox justifySelf="flex-end">
          <VuiTypography
            component="button"
            variant="button"
            color="white"
            fontWeight="regular"
            onClick={handleProfileSettings}
            sx={{
              background: 'none',
              border: 'none',
              padding: 0,
              mr: "5px",
              display: "inline-flex",
              alignItems: "center",
              justifySelf: "flex-end",
              cursor: "pointer",

              "& .material-icons-round": {
                fontSize: "1.125rem",
                transform: `translate(2px, -0.5px)`,
                transition: "transform 0.2s cubic-bezier(0.34,1.61,0.7,1.3)",
              },

              "&:hover .material-icons-round, &:focus  .material-icons-round": {
                transform: `translate(6px, -0.5px)`,
              },
            }}
          >
            View Profile Settings
            <Icon sx={{ fontWeight: "bold", ml: "5px" }}>arrow_forward</Icon>
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </Card>
  );
};

export default Welcome;
