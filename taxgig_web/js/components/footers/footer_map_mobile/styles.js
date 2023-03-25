import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { device, color, f_c_sb } from "../../styles";
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';


export const FooterMapContainer = styled.div`
    margin: 30px 0 46px;
`
export const FooterMapBlockMobile = styled(MuiExpansionPanel)`
    display: block;
    border: 0 !important;
    background: transparent !important; 
    box-shadow: none !important;

    &.Mui-expanded {
        margin: 0 !important;
    }

    &:before {
        background-color: unset !important;
    }
`;

export const FooterMapTitleMobile = styled(MuiExpansionPanelSummary)`
    cursor: pointer;
    margin: 0 !important;
    padding: 0 !important;
    font-size: 18px !important;
    line-height: 30px !important;
    color: ${color.white} !important;

    & .MuiExpansionPanelSummary-content {
        justify-content: space-between;
        align-items: center;
        margin: 12px 0 !important;
    }

`
export const FooterMapBoxStatus = styled.div`
    position: relative;
    line-height: 25px;
`

export const FooterMapBox = styled.ul`
    font-family: SF Pro Display;
    list-style: none;
`

export const MapItem = styled.li`
    margin-bottom: 24px;
   
`
export const MapLink = styled(NavLink)`
    margin-bottom: 24px;
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

export const MapLinkSocial = styled.a`
    margin-bottom: 24px;
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