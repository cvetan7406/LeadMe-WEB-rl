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

function navbar(theme, ownerState) {
  const { palette, boxShadows, functions, transitions, breakpoints, borders } = theme;
  const { transparentNavbar, absolute, light, miniSidenav } = ownerState;

  const { dark, white, text, transparent, gradients, borderCol } = palette;
  const { navbarBoxShadow } = boxShadows;
  const { linearGradient, pxToRem } = functions;
  const { borderRadius } = borders;

  return {
    boxShadow: navbarBoxShadow,
    backdropFilter: `blur(${pxToRem(42)})`,
    backgroundColor: transparentNavbar ? `${transparent.main} !important` : `${dark.main} !important`,
    backgroundImage: transparentNavbar
      ? 'none'
      : `${linearGradient(
          gradients.navbar.main,
          gradients.navbar.state,
          gradients.navbar.deg
        )} !important`,

    color: white.main,
    top: 0,
    minHeight: pxToRem(75),
    display: "grid",
    alignItems: "center",
    zIndex: 900,
    position: "sticky",
    width: "100%",
    padding: 0,

    borderRadius: borderRadius.xl,
    borderColor:
      transparentNavbar || absolute
        ? `${transparent.main} !important`
        : `${borderCol.navbar} !important`,

    "& > *": {
      transition: transitions.create("all", {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },

    "& .MuiToolbar-root": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      padding: `${pxToRem(4)} ${pxToRem(24)}`,

      [breakpoints.up("sm")]: {
        minHeight: "auto",
      },
    },
  };
}

const navbarContainer = ({ breakpoints }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
  padding: 0,
});

const navbarRow = ({ breakpoints, functions: { pxToRem }, palette: { white } }, { isMini, isRight }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: isRight ? "flex-end" : "flex-start",
  width: isRight ? "auto" : "100%",
  position: "relative",
  gap: pxToRem(16),
  "&.MuiBox-root": {
    "& nav": {
      "& ol": {
        "& li": {
          "&.MuiBreadcrumbs-li": {
            "& a": {
              "& span": {
                color: white.main,
              },
            },
          },
          "&.MuiBreadcrumbs-li span.MuiTypography-button": {
            color: white.main,
          },
          "&.MuiBreadcrumbs-separator": {
            color: white.main,
          },
        },
      },
    },
  },
  "& h6": {
    color: "rgb(255,255,255)",
  },

  [breakpoints.up("md")]: {
    justifyContent: isMini ? "space-between" : "stretch",
    width: isMini ? "100%" : "max-content",
  },

  [breakpoints.up("xl")]: {
    justifyContent: "stretch !important",
    width: "max-content !important",
  },
});

const navbarIconButton = ({ typography: { size }, breakpoints, palette: { grey, white } }) => ({
  px: 0.75,

  "& .material-icons, .material-icons-round": {
    fontSize: `${size.md} !important`,
    color: white.main,
  },

  "& .MuiTypography-root": {
    display: "none",
    color: white.main,

    [breakpoints.up("sm")]: {
      display: "inline-block",
      lineHeight: 1.2,
      ml: 0.5,
    },
  },
});

const navbarMobileMenu = ({ breakpoints, palette: { white } }) => ({
  display: "inline-block",
  lineHeight: 0,
  color: white.main,

  [breakpoints.up("xl")]: {
    display: "none",
  },
});

export { navbar, navbarContainer, navbarRow, navbarIconButton, navbarMobileMenu };
