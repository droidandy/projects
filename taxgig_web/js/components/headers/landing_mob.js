import React, { memo, useState } from "react";

// Style
import {
  Header,
  HeaderContent,
  HeaderLogo,
  HeaderRightSection,
  HeaderBurgerButton
} from "./styles";

import { LandingWrapper } from "../styles";

// Images
import LogoWithText from "../images/logo_with_text";
import LogoWithWhiteText from "../images/logo_with_white_text";

import BurgerMenu from "../images/burger_menu";
import WhiteBurgerMenu from "../images/white_burger_menu";
import GreyCross from "../images/grey_cross";
import WhiteCross from "../images/white_cross";

function LandingMobHeader(props) {
  const { active, toggleSlide, hideMobMenu, isPro } = props;

  // console.log(isPro);

  return (
    <Header isPro={isPro}>
      <LandingWrapper>
        <HeaderContent>
          <HeaderLogo to="/" onClick={hideMobMenu}>
            {isPro ? <LogoWithWhiteText /> : <LogoWithText />}
          </HeaderLogo>
          <HeaderBurgerButton onClick={toggleSlide}>
            {active ? isPro ? <WhiteCross /> : <GreyCross /> : isPro ? <WhiteBurgerMenu /> : <BurgerMenu />}
          </HeaderBurgerButton>
        </HeaderContent>
      </LandingWrapper>
    </Header>
  );
}

export default LandingMobHeader;
