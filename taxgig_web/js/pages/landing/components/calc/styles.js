import styled from "styled-components";

import { color, device, f_c_sb, f_c_c } from "../../../../components/styles";

export const Section = styled.div`
	padding-top: 32px;
	padding-bottom: 72px;

	 @media ${device.laptop} {
        padding-bottom: 128px;
    }
`;

export const ContainerSwithButton = styled.div`
	margin: 64px auto 0;        
    width: fit-content;
    box-shadow: 4px 10px 14px #ECEFF7;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }
`;

export const ContainerFilledButton = styled.div`
	 width: 208px;
   
    @media ${device.laptop} {
       
    }
`;

export const CalcBlock = styled.div`
	padding-bottom: 32px;
	margin: 24px auto 0;
    background: ${color.white};
    box-shadow: 8px 20px 30px #ECEFF7;
    border-radius: 10px;
    max-width: 588px;
    font-family: SF Pro Display;

    @media ${device.laptop} {
        max-width: 486px;
         margin: 24px 0 0 0;
    }
`;

export const CalcBlockResultWrapper = styled.div`
    position: absolute;
    top: 60px;
    bottom: 0;
    right: 0;
`;

export const CalcBlockResult = styled.div`
	margin: 24px auto 0;
    padding: 0 0 32px;
    background: ${color.white};
    box-shadow: 8px 20px 30px #ECEFF7;
    border-radius: 10px;
    max-width: 588px;
    font-family: SF Pro Display;

    @media ${device.laptop} {
    	position: sticky;
    	top: 24px;
    	right: 0;
        max-width: 282px;
        
    }
`;

export const CalcContainer = styled.div`
	@media ${device.laptop} {
        padding-top: 60px;
        max-width: 792px;
        margin: 0 auto;
        position: relative;
    }
`

export const BlockTitle = styled.h4`
	padding: 32px 32px 0;
    font-size: 18px;
    line-height: 30px;
    color: ${color.black};
    font-weight: 600;
    margin: 0;
`;

export const BlockLine = styled.div`
	margin-top: 32px;
    width: 100%;
    opacity: 0.5;
    border: 0.5px solid #B3B3C6;
`;

export const ContainerPadding = styled.div`
	padding: 0 32px;
`;

export const CalcStatusTitle = styled.p`
	padding: 32px 0 0;
	font-size: 14px;
	line-height: 30px;
	color: ${color.black};
	font-weight: 500;
	margin: 0;
`;

export const TaxTitle = styled.p`
	margin: 16px 0 0;
	font-family: SF Pro Display;
	font-size: 14px;
	line-height: 26px;
	color: ${color.darkGrey};
`;

export const TaxResult = styled.p`
	margin: 0;
	font-weight: 500;
	font-family: SF Pro Display;
	font-size: 24px;
	line-height: 40px;
	letter-spacing: 0.5px;
	color: ${props => props.color === 'red' ? color.red : props.color === 'green' ? color.green : color.black};
`;

export const ResultsTitle = styled.p`
	padding: 0 32px;
	margin-top: 24px;
	font-family: SF Pro Display;
	font-size: 14px;
	line-height: 24px;
	color: ${color.black};
`;

export const ResultsText = styled.p`
	padding: 0 32px;
	margin-top: 8px;
	font-family: SF Pro Display;
	font-style: normal;
	font-weight: normal;
	font-size: 12px;
	line-height: 20px;
	color: ${color.darkGrey};
`;

export const ContainerButton = styled.div`
    ${f_c_c};
    border-radius: 10px;
    box-shadow: 4px 10px 14px #ECEFF7;
    width: fit-content;
    margin: 0 auto;
    align-items: stretch;
`;

export const ButtonIncome = styled.button`
    ${f_c_c};
    font-family: "SF Pro Display", sans-serif;
    font-weight: 500;
    color: ${props => props.calcViewType === "income" ? color.white : color.black};
    background-color: ${props => props.calcViewType === "income" ? color.green : color.white};
    border: none;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    line-height: 24px;
    z-index: 1;
    transition: .3s;
    padding: 16px 24px;
    border-radius: 10px 0 0 10px;

    &:hover {
        background-color: ${color.greenHover};
        color: ${color.white};
    }

    &:active {
        background-color: ${color.greenActive};
    }

    &:disabled {
        background-color: #ecedfa;
        color: #b5b5d0;
    }
`;

export const ButtonBusiness = styled.button`
    ${f_c_c};
    font-family: "SF Pro Display", sans-serif;
    font-weight: 500;
    color: ${props => props.calcViewType === "business" ? color.white : color.black};
    background-color: ${props => props.calcViewType === "business" ? color.green : color.white};
    border: none;
    cursor: pointer;
    white-space: nowrap;
    font-size: 14px;
    line-height: 24px;
    z-index: 1;
    transition: .3s;
    padding: 16px 24px;

    &:hover {
        background-color: ${color.greenHover};
        color: ${color.white};
    }

    &:active {
        background-color: ${color.greenActive};
    }

    &:disabled {
        background-color: #ecedfa;
        color: #b5b5d0;
    }
`;

export const ButtonSales = styled.button`
    ${f_c_c};
    font-family: "SF Pro Display", sans-serif;
    font-weight: 500;
    color: ${props => props.calcViewType === "sales" ? color.white : color.black};
    background-color: ${props => props.calcViewType === "sales" ? color.green : color.white};
    border: none;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    line-height: 24px;
    z-index: 1;
    transition: .3s;
    padding: 16px 24px;
    border-radius: 0 10px 10px 0;

    &:hover {
        background-color: ${color.greenHover};
        color: ${color.white};
    }

    &:active {
        background-color: ${color.greenActive};
    }

    &:disabled {
        background-color: #ecedfa;
        color: #b5b5d0;
    }
`;

export const Gap = styled.div`
    width: 100%;
    height: 16px;
    background-color: transparent;
`;
