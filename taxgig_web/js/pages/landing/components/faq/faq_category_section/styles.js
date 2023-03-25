import styled from "styled-components";

import { NavLink } from "react-router-dom";

import { color, device, f_c_sb, hShadow, transition } from "../../../../../components/styles";

export const Section = styled.div`  
`;

export const FaqPathSection = styled.div`
    padding-bottom: 16px;
    margin: 0 auto;
    max-width: 588px;

    @media ${device.laptop} {
        padding-bottom: 56px;
        max-width: 790px;
    }
`;

export const PathLink = styled(NavLink)`
    font-family: SF Pro Display;
    font-size: 14px;
    line-height: 24px;
    color: #292F42;
    text-decoration: none;
    transition: .3s;

    &:focus {
        outline: none;
    }
`;

export const PathTitle = styled.span`
    font-family: SF Pro Display;
    font-size: 14px;
    line-height: 24px;
    color: #9090AB;
`;

export const ArticleBlock = styled.div`
    margin: 0 auto;
    flex-direction: column;
    padding-top: 10px;
    flex-wrap: wrap;
    ${f_c_sb}

    @media ${device.laptop} {
        
    }
`;

export const ArticleItem = styled.div`
    max-width: 588px;
    width: 100%;
    margin-bottom: 24px;
    padding: 32px 24px;
    font-family: SF Pro Display;
    background: #FFFFFF;
    box-shadow: 4px 8px 8px rgba(98, 107, 126, 0.07);
    border-radius: 10px;
    box-sizing: border-box;
    ${transition};

    &:hover {
        ${hShadow};
        cursor: pointer;
    }

    &:last-child{
        margin-bottom: 0; 
    }

    @media ${device.laptop} {
        max-width: 790px;
    }
`;

export const ArticleItemHeader = styled.h3`
    font-weight: bold;
    font-size: 18px;
    line-height: 34px;
    color: ${color.black};
`;

export const ArticleItemDescription = styled.p`
    font-size: 14px;
    line-height: 24px;
    color: #9090AB;
`;





