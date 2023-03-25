import React from "react";

import {
	MenuContainer,
	MenuContent,
	MenuNav,
	MenuNavTitle,
	MenuNavList,
	MenuNavListEl,
	MenuNavListElLink,
	MenuNavListElLinkDark,
	MenuNavListElLinkExternal,
	MenuPrimeNav,
	MenuPrimeNavBtn,
	MenuNavListElLinkGreen,
	BorderTop,
	Footer
} from "./styles";

import { LandingWrapper } from "../styles";

import Remark from "../footers/footer_remark";
//Import components
import GreyArrowRight from "../images/grey_arrow_right";

function LandingMobMenu(props) {
	const { hideMobMenu, isPro } = props;

	return (
		<MenuContainer>
			<LandingWrapper>
				<MenuContent>
					<MenuNav>
						<MenuNavList>
							<MenuNavTitle>Menu</MenuNavTitle>
							<MenuNavListEl>
								{!isPro ? (
									<MenuNavListElLink
										to="/about"
										onClick={hideMobMenu}
										activeClassName="active-link" exact
									>
										About
									</MenuNavListElLink>
								) : (
									<MenuNavListElLinkDark
										to="/about"
										onClick={hideMobMenu}
										activeClassName="active-link" exact
									>
										About
									</MenuNavListElLinkDark>
								)}
							</MenuNavListEl>
							<MenuNavListEl>
								<MenuNavListElLinkExternal
									isPro={isPro}
									href="/blog"
								>
									Blog
								</MenuNavListElLinkExternal>
							</MenuNavListEl>
							<MenuNavListEl>
								{!isPro ? (
									<MenuNavListElLink
										to="/faq"
										onClick={hideMobMenu}
										activeClassName="active-link" exact
									>
										FAQ
									</MenuNavListElLink>
								) : (
									<MenuNavListElLinkDark
										to="/faq"
										onClick={hideMobMenu}
										activeClassName="active-link" exact
									>
										FAQ
									</MenuNavListElLinkDark>
								)}
							</MenuNavListEl>
						</MenuNavList>
					</MenuNav>
					<MenuPrimeNav>
						<BorderTop>
							<MenuNavListElLinkGreen
								to="/consultation"
								onClick={hideMobMenu}
								activeClassName="active-link" exact
							>
								Free consultation
							</MenuNavListElLinkGreen>
						</BorderTop>
						<BorderTop>
							<MenuPrimeNavBtn>
								{isPro ? (
									<MenuNavListElLinkDark to="/" onClick={hideMobMenu}>
										Stay as client
									</MenuNavListElLinkDark>
								) : (
									<MenuNavListElLink
										to="/pro"
										onClick={hideMobMenu}
									>
										Be a Pro
									</MenuNavListElLink>
								)}
								<GreyArrowRight />
							</MenuPrimeNavBtn>
						</BorderTop>

					</MenuPrimeNav>
					<Footer>
						<Remark color="grey" />
					</Footer>
				</MenuContent>
			</LandingWrapper>
		</MenuContainer>
	);
}

export default LandingMobMenu;
