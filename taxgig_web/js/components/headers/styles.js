import styled from "styled-components";
import { NavLink } from "react-router-dom";
// SSR must have: import styled from "styled-components/macro";
import { device, f_c_sb, color } from "../styles";

import OutlinedButtonArrowRight from "../buttons/outlined_button_arrow_right/index";

export const Header = styled.header`
	padding: 16px 0;
	background-color: ${props => (props.isPro ? color.black : color.darkWhite )};
	border-bottom: 0.5px solid ${props => (props.isPro ? "#20263A" : "rgb(245, 245, 255)" )};
	position: absolute;
	width: 100%;
	height: 54px;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
`;

export const HeaderContent = styled.div`
	${f_c_sb};
`;

export const HeaderLogo = styled(NavLink)`
	position: relative;
	z-index: 999;
	transition: .3s;

	@media ${device.laptop} {
		padding-left: 32px;
	}
`;

export const HeaderRightSection = styled.div`
	${f_c_sb};
	max-width: 600px;
	width: 100%;
`;

export const HeaderNav = styled.nav`
	max-width: 246px;
	width: 100%;
`;

export const HeaderNavList = styled.ul`
	${f_c_sb};
	width: 100%;
	list-style: none;
`;

export const HeaderNavListEl = styled(NavLink)`
	color: ${color.darkGrey};
	font-size: 14px;
	line-height: 24px;
	font-weight: 600;
	text-decoration: none;
	transition: all 0.3s ease;

	&.active-link {
		color: ${color.greenHover};
	}
`;

export const HeaderNavListElDark = styled(HeaderNavListEl)`
	color: ${color.grey};
`;

export const HeaderNavListElExternal = styled.a`
	color: ${props => (props.isPro ? color.grey : color.darkGrey )};
	font-size: 14px;
	line-height: 24px;
	font-weight: 600;
	text-decoration: none;
	transition: all 0.3s ease;
`;

export const HeaderPrimeNav = styled.div`
	${f_c_sb};
`;

export const HeaderBurgerButton = styled.div`
	float: right;
`;
