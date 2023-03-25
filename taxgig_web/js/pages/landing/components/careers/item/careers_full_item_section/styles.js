import styled from "styled-components";

import { color, device, f_c_sb } from "../../../../../../components/styles";

export const Section = styled.div`
	padding-top: 40px;
	margin: 0 auto;
	max-width: 588px;

     @media ${device.laptop} {
	    max-width: 728px;
     }
`;

export const CareersCategory = styled.p`
	font-family: SF Pro Display;
	font-style: normal;
	font-weight: 500;
	font-size: 12px;
	line-height: 24px;
	letter-spacing: 3px;
	text-transform: uppercase;
	color: #61AD15;
`;

export const ContainerButton = styled.div`
    max-width: 125px;
    margin-top: 24px;
	width: 100%;
`;

export const CareersPosition = styled.h3`
	font-family: SF Pro Display;
	font-style: normal;
	font-weight: bold;
	font-size: 18px;
	line-height: 34px;
	color: #292F42;
`;

export const TextQualifications = styled.p`
	padding-top: 32px;
	font-family: SF Pro Display;
	font-size: 14px;
	line-height: 24px;
	color: #000000;
	font-weight: bold;
`;

export const BlockList = styled.ul`
	list-style: none;
	padding-top: 10px;
	padding-bottom: 10px;
`;

export const BlockListItem = styled.li`
	position: relative;
	margin-left: 28px;
	font-family: SF Pro Display;
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 24px;
	color: #292F42;

	&::before {
        content: url(../../../../../../images/list-item-marker.svg);
        vertical-align: top;
        position: absolute;
   		left: -28px;
    }
`;

export const AboutPositionBlock = styled.div`
	margin-top: 32px;
	font-family: SF Pro Display;
`;

export const AboutPositionHeader = styled.h3`
	font-style: normal;
	font-weight: bold;
	font-size: 18px;
	line-height: 34px;
	color: #292F42;
`;

export const AboutPositionParagrarh = styled.p`
	padding-top: 24px;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    color: #292F42;

    &:first-child {
        padding-top: 0;
    }
`;

export const TextResponsibilities = styled.p`
	margin-top: 32px;
	font-family: SF Pro Display;
	font-style: normal;
	font-weight: bold;
	font-size: 18px;
	line-height: 34px;
	color: #292F42;
`;



