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

// @mui material components
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

// Vision UI Dashboard React components
import VuiBox from "../../../../components/VuiBox";
import VuiTypography from "../../../../components/VuiTypography";

function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <VuiBox
      component="footer"
      py={6}
      sx={({ breakpoints }) => ({
        maxWidth: "450px",
        [breakpoints.down("xl")]: {
          maxWidth: "400px",
        },
      })}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <VuiTypography
            variant="button"
            sx={{ textAlign: "center", fontWeight: "400 !important" }}
            color="text"
          >
            @ 2025, Created by Cyber Operations Ltd
          </VuiTypography>
        </Grid>
        <Grid item xs={10}>
          <VuiBox display="flex" justifyContent="center" flexWrap="wrap" mb={3}>
            <VuiBox mr={{ xs: "20px", lg: "46px" }}>
              <VuiTypography
                component="button"
                variant="body2"
                color="text"
                onClick={() => handleNavigation('/marketplace')}
                sx={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer'
                }}
              >
                Marketplace
              </VuiTypography>
            </VuiBox>
            <VuiBox mr={{ xs: "20px", lg: "46px" }}>
              <VuiTypography
                component="button"
                variant="body2"
                color="text"
                onClick={() => handleNavigation('/blog')}
                sx={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer'
                }}
              >
                Blog
              </VuiTypography>
            </VuiBox>
            <VuiBox>
              <VuiTypography
                component="button"
                variant="body2"
                color="text"
                onClick={() => handleNavigation('/license')}
                sx={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer'
                }}
              >
                License
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </Grid>
      </Grid>
    </VuiBox>
  );
}

export default Footer;
