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

export function collapseItem(theme, ownerState) {
  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
  const { active, transparentSidenav, miniSidenav } = ownerState;

  const { white, transparent, dark, grey } = palette;
  const { md } = boxShadows;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    background: active ? palette.gradients.dark.main : transparent.main,
    color: white.main,
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: `${pxToRem(10.8)} ${pxToRem(12.8)} ${pxToRem(10.8)} ${pxToRem(16)}`,
    margin: `0 ${pxToRem(16)}`,
    borderRadius: borderRadius.lg,
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    boxShadow: active && transparentSidenav ? md : "none",
    [breakpoints.up("xl")]: {
      transition: transitions.create(["box-shadow", "background-color"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.shorter,
      }),
    },
    "&:hover, &:focus": {
      backgroundColor: transparentSidenav ? grey[700] : transparent.main,
    },
  };
}

export function nestedItem(theme, ownerState) {
  const { palette, transitions, borders, functions } = theme;
  const { active, transparentSidenav } = ownerState;

  const { white, transparent, grey } = palette;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    ...collapseItem(theme, ownerState),
    padding: `${pxToRem(8)} ${pxToRem(12)} ${pxToRem(8)} ${pxToRem(10)}`,
    margin: `${pxToRem(4)} ${pxToRem(16)} ${pxToRem(4)} ${pxToRem(24)}`,
    fontSize: "0.85rem",
    borderRadius: borderRadius.md,
    "&:hover, &:focus": {
      backgroundColor: transparentSidenav ? grey[700] : transparent.main,
      opacity: 0.9,
    },
  };
}

export function collapseIconBox(theme, ownerState) {
  const { palette, transitions, borders, functions } = theme;
  const { transparentSidenav, color, active } = ownerState;

  const { white, dark, gradients } = palette;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    minWidth: pxToRem(32),
    minHeight: pxToRem(32),
    color: (transparentSidenav && !active) ? white.main : white.main,
    borderRadius: borderRadius.md,
    display: "grid",
    placeItems: "center",
    transition: transitions.create("margin", {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),
    marginRight: pxToRem(10),
    backgroundColor: active 
      ? color === "default" 
        ? gradients.dark.main 
        : palette[color].main 
      : "transparent",
    "& svg, svg g": {
      fill: (transparentSidenav && !active) ? white.main : white.main,
    },
  };
}

export const collapseText = (theme, ownerState) => {
  const { typography, transitions, breakpoints, functions } = theme;
  const { miniSidenav, transparentSidenav, active } = ownerState;

  const { size, fontWeightMedium } = typography;
  const { pxToRem } = functions;

  return {
    marginLeft: pxToRem(10),
    [breakpoints.up("xl")]: {
      opacity: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : 1,
      maxWidth: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : "100%",
      marginLeft: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : pxToRem(10),
      transition: transitions.create(["opacity", "margin"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },
    "& span": {
      fontWeight: active ? fontWeightMedium : fontWeightMedium,
      fontSize: size.sm,
      lineHeight: 0,
    },
  };
};
