import styled from "styled-components";

import { color, device, f_c_sb } from "../../../../../../components/styles";

export const Section = styled.div`
	padding-top: 32px;

     @media ${device.laptop} {
        padding-top: 72px;
     }
`;

export const CareersHeaderBlock = styled.div`
    margin: 0 auto;
    max-width: 588px;
    padding-top: 24px;
	width: 100%;

     @media ${device.laptop} {
        max-width: 790px;
        padding-top: 56px;
    }
`;

export const CareersHeaderParagparh = styled.p`
    padding-top: 24px;
	font-family: SF Pro Display;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    color: #626B7E;

    &:first-child {
        padding-top: 0;
    }

    @media ${device.laptop} {
       padding-top: 16px;
    }
`;



