import styled from "styled-components";
import { NavLink } from "react-router-dom";

import { color, device, f_c_sb } from "../../../../../../components/styles";

export const Section = styled.div`
	padding-top: 24px;
    margin: 0 auto;
    max-width: 588px;

     @media ${device.laptop} {
        padding-top: 112px;
        max-width: 728px;
     }
`;

export const CareersPathSection = styled.div`
    padding-top: 24px;

    @media ${device.laptop} {
        padding-top: 56px;
    }
`;

export const CareersLink = styled(NavLink)`
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

export const CareersTitle = styled.span`
    font-family: SF Pro Display;
    font-size: 14px;
    line-height: 24px;
    color: #9090AB;
`;




