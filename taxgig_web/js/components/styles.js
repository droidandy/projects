import styled from "styled-components";

export const LandingWrapperPadding = "16px";

// Color palette
export const color = {
  white: "#FFFFFF",
  darkWhite: "#F9FBFF",
  green: "#61AD15",
  greenHover: "#599C15",
  greenActive: "#4F8F0F",
  black: "#292F42",
  darkGrey: "#626B7E",
  grey: "#B5B5D0",
  lightGrey: "#D4D4E4",
  red: "#F13C3C",
  purple: "#7B09DF",
  orange: "#FFA826",

};

// Based on: https://jsramblings.com/2018/02/04/styled-components-media-queries.html
export const size = {
  mobileS: "320",
  mobileM: "375",
  mobileL: "425",
  tablet: "768",
  laptop: "1024",
  laptopL: "1440",
  desktop: "2560"
};

export const device = {
  mobileS: `(min-width: ${size.mobileS}px)`,
  mobileM: `(min-width: ${size.mobileM}px)`,
  mobileL: `(min-width: ${size.mobileL}px)`,
  tablet: `(min-width: ${size.tablet}px)`,
  laptop: `(min-width: ${size.laptop}px)`,
  laptopL: `(min-width: ${size.laptopL}px)`,
  desktop: `(min-width: ${size.desktop}px)`,
  desktopL: `(min-width: ${size.desktop}px)`,
  tillMobileS: `(max-width: ${size.mobileS}px)`,
  tillMobileM: `(max-width: ${size.mobileM}px)`,
  tillMobileL: `(max-width: ${size.mobileL}px)`,
  tillTablet: `(max-width: ${size.tablet}px)`,
  tillLaptop: `(max-width: ${size.laptop}px)`,
  tillLaptopL: `(max-width: ${size.laptopL}px)`,
  tillDesktop: `(max-width: ${size.desktop}px)`,
  tillDesktopL: `(max-width: ${size.desktop}px)`
};

// Resusable css (i.e. mixins)
export const f_c_sb = `
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const f_c_c = `
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const f_sb = `
  display: flex;
  justify-content: space-between;
`;

export const f_sa = `
  display: flex;
  justify-content: space-around;
`;

export const f_cy = `
  display: flex;
    align-items: center;
`;

export const transition = `
  transition: all 0.3s ease;
`;

export const wShadow = `
  box-shadow: 4px 9px 24px rgba(180, 180, 208, 0.1);
`;

export const hShadow = `
  box-shadow: 8px 20px 30px rgba(98, 107, 126, 0.1);
`;

// Containers' css
export const LandingWrapper = styled.div`
  position: relative;
  max-width: 1200px;
  width: 100%;
  height: 100%;
  padding: 0 ${LandingWrapperPadding};
  margin: 0 auto;
  font-family: "SF Pro Display";
  box-sizing: border-box;
`;

export const LandingMainContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const LandingBody = styled.div`
  position: relative;
  background-color: ${props => (props.isPro ? color.black : color.darkWhite )};
  width: 100%;
  height: calc(100% - 54px - 2 * (${LandingWrapperPadding})) !important;
  padding-top: calc(54px + 2 * (${LandingWrapperPadding}));
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const RegistrationMainContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const RegistrationBody = styled.div`
  position: relative;
  background-color: ${color.darkWhite};
  width: 100%;
  height: calc(100% - 54px - 2 * (${LandingWrapperPadding}));
  padding-top: calc(54px + 2 * (${LandingWrapperPadding}));
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
`;
