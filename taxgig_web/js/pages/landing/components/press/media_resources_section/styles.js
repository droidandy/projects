import styled from "styled-components";

import { color, device, hShadow, transition, f_c_sb } from "../../../../../components/styles";

export const Section = styled.div`
	margin: 72px 0;

`;


export const MediaBlock = styled.ul`
	flex-direction: column;
    margin-top: 56px;
    display: flex;
    justify-content: space-between;
    align-items: stretch;

     @media ${device.laptop} {
       flex-direction: row;  
       flex-wrap: wrap;
    }
`

export const MediaBox = styled.a`
    text-decoration: none;
	max-width: 588px;
    box-sizing: border-box;
    padding: 32px;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0 auto 32px;
    background: #FFFFFF;
	box-shadow: 4px 8px 8px rgba(98, 107, 126, 0.07);
	border-radius: 10px;
    ${transition};

    &:hover {
        ${hShadow};
        cursor: pointer;
    }
    
    @media ${device.laptop} {
       flex-basis: calc(50% - 12px);
       margin: 0 0 32px;
    }
`

export const MediaTitle = styled.h3`
	color: #292F42;
    font-size: 18px;
    line-height: 30px;
    font-weight: 600;
    letter-spacing: 0.5px;
`

export const MediaText = styled.p`
	color: ${color.darkGrey};
    margin-top: 4px;
    margin-bottom: 30px;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0.5px;
`

export const MediaButton = styled.button`
	color: #B5B5D0;
    text-transform: uppercase;
    font-weight: 600;
    transition: all 0.3s ease;
    text-align: left;
    background: none;
    border: none;
    font-size: 12px;
    line-height: 20px;
    letter-spacing: 0.3px;
    transition: .3s;

    &:hover {
       color: ${color.green};
    }

    &::after {
        opacity: 0;
        content: url(../../../../../images/green-arrow-right.svg);
        transition: all 0.3s ease; 
    }

    &:hover::after {
       opacity: 1;
       margin-left: 24px;
    }
`



