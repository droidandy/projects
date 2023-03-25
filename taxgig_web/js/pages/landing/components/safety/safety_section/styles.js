import styled from "styled-components";

import { color, device, f_c_sb } from "../../../../../components/styles";

export const Section = styled.div`
	padding-top: 32px;

     @media ${device.laptop} {
        padding-top: 72px;
     }
`;

export const SafetyBlock = styled.div`
    margin: 0 auto;
    max-width: 588px;
    padding-top: 32px;
	width: 100%;

     @media ${device.laptop} {
        max-width: 790px;
    }

`

export const SafetyText = styled.p`
	font-family: SF Pro Display;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 26px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #292F42;

     @media ${device.laptop} {
       
       
    }

`



