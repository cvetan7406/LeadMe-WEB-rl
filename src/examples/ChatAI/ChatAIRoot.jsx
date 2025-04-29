import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";

export default styled(Drawer)(({ theme, ownerState }) => {
  const { boxShadows, functions, transitions, palette } = theme;
  const { openConfigurator } = ownerState;

  const { gradients } = palette;
  const configuratorWidth = 360;
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
    right: pxToRem(-350),
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
      overflowY: "hidden", // Changed from auto to hidden since we handle scroll in the chat container
      backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent dark background
      backdropFilter: "blur(8px)", // Add blur effect
      ...(openConfigurator ? drawerOpenStyles() : drawerCloseStyles()),

      // Styling for react-chat-elements
      "& .rce-container-mbox": {
        backgroundColor: "transparent",
      },
      "& .rce-mbox": {
        backgroundColor: palette.info.main,
        color: palette.common.white,
      },
      "& .rce-mbox-right": {
        backgroundColor: palette.primary.main,
      },
      "& .rce-input": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        color: palette.common.white,
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "10px",
        "& input": {
          color: palette.common.white,
          "&::placeholder": {
            color: "rgba(255, 255, 255, 0.5)",
          },
        },
      },
      "& .rce-mbox-time": {
        color: "rgba(255, 255, 255, 0.5)",
      },
    },
  };
});