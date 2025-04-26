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

import { forwardRef } from "react";
import PropTypes from 'prop-types';
import VuiButtonRoot from "../../components/VuiButton/VuiButtonRoot";

const VuiButton = forwardRef(
  ({ 
    color = "white", 
    variant = "contained", 
    size = "medium", 
    circular = false, 
    iconOnly = false, 
    children, 
    ...rest 
  }, ref) => (
    <VuiButtonRoot
      {...rest}
      ref={ref}
      color={color}
      variant={variant === "gradient" ? "contained" : variant}
      size={size}
      ownerState={{ color, variant, size, circular, iconOnly }}
    >
      {children}
    </VuiButtonRoot>
  )
);

VuiButton.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["text", "contained", "outlined", "gradient"]),
  color: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
    "text"
  ]),
  circular: PropTypes.bool,
  iconOnly: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default VuiButton;