import styled from "styled-components";

import { color, device, f_c_sb } from "../../../../../../components/styles";

export const Container = styled.div`
	margin: 0 auto 16px;
	max-width: 588px;
    width: 100%;
	padding: 32px;
	background: #FFFFFF;
	box-shadow: 4px 8px 8px rgba(98, 107, 126, 0.07);
	border-radius: 10px;
	box-sizing: border-box;
    flex-basis: calc(50% - 12px);

     @media ${device.laptop} {
       margin: 0 0 24px 0;
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

export const CareersPosition = styled.h3`
	font-family: SF Pro Display;
	font-style: normal;
	font-weight: bold;
	font-size: 18px;
	line-height: 34px;
	color: #292F42;
`;

export const CareersText = styled.p`
	margin-top: 16px;
	font-family: SF Pro Display;
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	line-height: 24px;
	color: #292F42;
`;

export const CareersShortDescription = styled.p`
	margin-top: 10px;
	font-family: SF Pro Display;
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 24px;
	color: #626B7E;
`;

export const CareersOutlinedButton = styled.button`
	margin-top: 24px;
	font-family: SF Pro Display;
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 26px;
	color: #61AD15;
	background-color: transparent;
	border: 1px solid ${color.green};
    border-radius: 4px;
    cursor: pointer;
    padding: 0 16px;
    height: 48px;
    transition: .3s;

    &:hover {
        background-color: rgba(97, 173, 21, 0.05);
    }

    &:active {
        background-color: rgba(97, 173, 21, 0.1);
    }

    &:disabled {
        background-color: transparent;
        color: ${color.greenDisabled};
        border: 1px solid #ECEDFA;
`;





