import styled from "styled-components";
import { NavLink } from "react-router-dom";

import { color, device, f_c_sb, hShadow, transition } from "../../../../../components/styles";

export const Section = styled.div`
`;

export const FaqPathSection = styled.div`
    padding-bottom: 30px;
    margin: 0 auto;
    max-width: 588px;

    @media ${device.laptop} {
        padding-bottom: 36px;
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

export const FaqItemBlock = styled.div`
    
`;