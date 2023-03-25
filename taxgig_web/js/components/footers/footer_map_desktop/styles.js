import styled from "styled-components";
import { device, color, f_sa } from "../../styles";
import { NavLink } from "react-router-dom";

export const FooterRight = styled.div`
    ${f_sa};
    max-width: 588px;
    width: 100%;
`

export const FooterMapBlock = styled.div`
    display: block;
`

export const FooterMapTitle = styled.h4`
    margin-bottom: 32px;
    font-size: 18px;
    line-height: 30px;
    color: ${color.white};
`

export const FooterMapBox = styled.ul`
    font-family: SF Pro Display;
    list-style: none;
`

export const MapItem = styled.li`
    margin-bottom: 14px;
`

export const MapLink = styled(NavLink)`
    text-decoration: none;
    font-size: 14px;
    line-height: 24px;
    color: ${color.white};
    opacity: 0.5;
    transition: .3s;

    &:hover {
        opacity: 1;
        border-bottom: 1px solid white;
    } 

    &:focus {
        outline: none;
    }

    &.active-link {
        opacity: 1;
        border-bottom: 1px solid white;
    }
`

export const MapLinkSocial = styled.a`
    text-decoration: none;
    font-size: 14px;
    line-height: 24px;
    color: ${color.white};
    opacity: 0.5;
    transition: .3s;

    &:hover {
        opacity: 1;
        border-bottom: 1px solid white;
    } 

    &:focus {
        outline: none;
    }
`