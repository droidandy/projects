import React, { memo, useState } from "react";

// Style
import {
  Header,
  HeaderContent,
  HeaderLogo,
  HeaderRightSection,
  HeaderNav,
  HeaderNavList,
  HeaderNavListEl,
  HeaderNavListElDark,
  HeaderNavListElExternal,
  HeaderPrimeNav
} from "./styles";

import { LandingWrapper } from "../styles";

// Images
import LogoWithText from "../images/logo_with_text";
import LogoWithWhiteText from "../images/logo_with_white_text";

// Components
import OutlinedButtonArrowRight from "../buttons/outlined_button_arrow_right/index";
import FilledButtonGreen from "../buttons/filled_button_green";

class LandingHeader extends React.Component {
  // HeaderNavListEl has two seperate components, as NavLink can't pass props without error

  render() {
    const { dispatch, isPro } = this.props;

    return (
      <Header isPro={isPro}>
        <LandingWrapper>
          <HeaderContent>
            <HeaderLogo to="/">
              {isPro ? <LogoWithWhiteText /> : <LogoWithText />}
            </HeaderLogo>
            <HeaderRightSection>
              <HeaderNav>
                <HeaderNavList>
                  <li>
                    {!isPro ? (
                      <HeaderNavListEl to="/about" activeClassName="active-link" exact>About</HeaderNavListEl>
                    ) : (
                      <HeaderNavListElDark to="/about">
                        About
                      </HeaderNavListElDark>
                    )}
                  </li>
                  <li>
                    <HeaderNavListElExternal
                      isPro={isPro}
                      href="/blog"
                    >
                      Blog
                    </HeaderNavListElExternal>
                  </li>
                  <li>
                    {!isPro ? (
                      <HeaderNavListEl to="/faq" activeClassName="active-link" exact>FAQ</HeaderNavListEl>
                    ) : (
                      <HeaderNavListElDark to="/faq" activeClassName="active-link" exact>FAQ</HeaderNavListElDark>
                    )}
                  </li>
                </HeaderNavList>
              </HeaderNav>
              <HeaderPrimeNav>
              <FilledButtonGreen to="/consultation" innerText="Free consultation" />
              </HeaderPrimeNav>
              <HeaderPrimeNav>
                {!isPro ? (
                  <OutlinedButtonArrowRight to="/pro" innerText="Be a Pro" />
                ) : (
                  <OutlinedButtonArrowRight to="/" innerText="Stay as client" />
                )}
              </HeaderPrimeNav>
            </HeaderRightSection>
          </HeaderContent>
        </LandingWrapper>
      </Header>
    );
  }
}

export default LandingHeader;
