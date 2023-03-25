import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { device, color, f_sb } from "../styles";


export const CookiesContainer = styled.div`
	background-color: ${props => props.isPro ? color.white : color.black};
	color: white;
	z-index: 100;
    width: 100%;
    position: fixed;
    bottom: 0;
`;

export const CookiesWrapper = styled.div`
   position: relative;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    padding: 32px;
    margin: 0 auto;
    flex-wrap: wrap;

    @media ${device.laptop} {
        flex-wrap: nowrap;
    }
`;

export const ContainerButton = styled.div`

`;

export const CookiesText = styled.p`
    font-family: SF Pro Display;
    font-size: 16px;
    line-height: 31px;
    color: ${props => props.isPro ? color.black : color.white};
    max-width: 902px;
    margin-bottom: 32px;

    @media ${device.laptop} {
        margin-right: 50px;
        margin-bottom: 0;
    }
`;

export const CookiesLink = styled(NavLink)`
	font-family: SF Pro Display;
    font-size: 16px;
    line-height: 31px;
    color: ${color.green};
    transition: .3s;
`;

