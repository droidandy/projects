import styled from "styled-components";

import { NavLink } from "react-router-dom";
import { color } from "../styles";

export const MenuContainer = styled.div`
	width: 100%;
	height: 100%;
`;

export const MenuContent = styled.div`
	display: flex;
    flex-direction: column;
    height: 100%;
`;

export const MenuNav = styled.div`
	padding: 0px 16px 0;
`;

export const MenuNavTitle = styled.div`
	font-size: 12px;
	line-height: 20px;
	display: flex;
	align-items: center;
	text-align: center;
	letter-spacing: 0.5px;
	text-transform: uppercase;
	color: ${color.lightGrey};
	padding-bottom: 20px;
`;

export const MenuNavList = styled.ul`
	display: flex;
	flex-direction: column;
	padding-bottom: 12px;
	padding-top: 15px;
	list-style: none;
`;

export const MenuNavListEl = styled.li`
	padding-bottom: 20px;
`;

export const MenuNavListElLink = styled(NavLink)`
	display: block;
	width: 100%;
	font-size: 18px;
	line-height: 30px;
	letter-spacing: 0.5px;
	color: ${color.darkGrey};
	font-weight: 600;
	text-decoration: none;
	transition: .3s;

	&.active-link {
		color: ${color.greenHover};
	}
`;

export const MenuNavListElLinkGreen = styled(NavLink)`
	display: block;
	width: 100%;
	letter-spacing: 0.5px;
	color: ${color.green};
	font-weight: 600;
	text-decoration: none;
	transition: .3s;
	font-size: 24px;
	line-height: 40px;
	margin-top: 35px;
	&.active-link {
		color: ${color.greenHover};
	}
`;


export const BorderTop = styled.div`
	padding: 0px;
	margin: 0;
	border-top: 0.5px solid #D4D4E4;
`;

export const MenuNavListElLinkDark = styled(MenuNavListElLink)`
	color: ${color.grey};

	&.active-link {
		color: ${color.greenHover};
	}
`;

export const MenuNavListElLinkExternal = styled.a`
	display: block;
	width: 100%;
	font-size: 18px;
	line-height: 30px;
	letter-spacing: 0.5px;
	color: ${props => (props.isPro ? color.grey : color.darkGrey )};
	font-weight: 600;
	text-decoration: none;
    transition: .3s;
`;

export const MenuPrimeNav = styled.div`
	//border-top: 0.5px solid;
	padding: 0px 16px;
	// border-color: #D4D4E4;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    padding-bottom: 57px;
`;

export const MenuPrimeNavBtn = styled.div`
	width: 100%;
	font-size: 18px;
    line-height: 30px;
    letter-spacing: 0.5px;
    display: flex;
    justify-content: space-between;
    padding: 33px 0;
    color: ${color.darkGrey};
    font-weight: 600;
    text-decoration: none;
        align-items: center;
`;

export const Footer = styled.div`
	position: absolute;
	width: 100%;
	bottom: 0;
	left: 0;
`;
