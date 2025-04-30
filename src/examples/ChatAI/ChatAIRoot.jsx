import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";

export default styled(Drawer)(({ theme, ownerState }) => {
  const { boxShadows, functions, transitions, palette } = theme;
  const { openConfigurator } = ownerState;

  const { gradients } = palette;
  const configuratorWidth = 720;
  const { lg } = boxShadows;
  const { pxToRem, linearGradient } = functions;

  // drawer styles when openConfigurator={true}
  const drawerOpenStyles = () => ({
    width: configuratorWidth,
    left: "initial",
    right: 0,
    transition: transitions.create("right", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.short,
    }),
  });

  // drawer styles when openConfigurator={false}
  const drawerCloseStyles = () => ({
    left: "initial",
    right: pxToRem(-700),
    transition: transitions.create("all", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.short,
    }),
  });

  return {
    "& .MuiDrawer-paper": {
      height: "100vh",
      margin: 0,
      padding: `0 ${pxToRem(10)}`,
      borderRadius: 0,
      boxShadow: lg,
      overflowY: "hidden",
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease-in-out",
      ...(openConfigurator ? drawerOpenStyles() : drawerCloseStyles()),

      // Enhanced chat container styling
      "& .MuiBox-root": {
        transition: "all 0.2s ease-in-out",
      },

      // Message animations
      "& .MuiAvatar-root": {
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "scale(1.1)",
        },
      },

      // Input field styling
      "& .MuiTextField-root": {
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-1px)",
        },
      },

      // Scrollbar styling
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-track": {
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "3px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "3px",
        "&:hover": {
          background: "rgba(255, 255, 255, 0.3)",
        },
      },
    },
  };
});