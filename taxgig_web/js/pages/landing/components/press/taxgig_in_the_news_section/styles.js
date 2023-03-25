import styled from "styled-components";

import { color, device, transition, hShadow, f_c_sb } from "../../../../../components/styles";

export const Section = styled.div`
	padding-top: 32px;
`;

export const PressBlock = styled.ul`
	display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 56px;	

    @media ${device.laptop} {
       flex-direction: row;  
    }
`;

export const PressBox = styled.a`
    text-decoration: none;
	max-width: 588px;
    width: 100%;
    flex-basis: 100%;
    margin: 0 auto 32px;
    background-color: #fff;
    box-shadow: 4px 9px 24px rgba(180, 180, 208, 0.1);
    border-radius: 10px;
    padding: 32px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    ${transition};

    &:hover {
        ${hShadow};
        cursor: pointer;
    }

     @media ${device.laptop} {
       flex-direction: row;
       flex-basis: calc(50% - 12px);
       margin: 0 0 32px;
    }
`;

export const PressBoxLeft = styled.div`
	margin-right: 32px;
`;

export const PressBoxRight = styled.div`
	margin-right: 32px;
`;

export const PressImage = styled.img`
	width: 180px;
	height: 154px;
	object-fit: cover;
	border-radius: 10px;
`;

export const PressAuthor = styled.p`
	margin-top: 32px;
	letter-spacing: 3px;
    text-transform: uppercase;
    color: ${color.green};
    font-size: 12px;
    line-height: 24px;

    @media ${device.laptop} {
       margin-top: 0;
    }
`;

export const PressTitle = styled.h3`
	margin-top: 8px;
    color: #292F42;
    font-size: 18px;
    line-height: 30px;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
`;

export const PressText = styled.p`
	margin-top: 4px;
    color: #292F42;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
`;

export const PressDate = styled.p`
	margin-top: 8px;
    color: ${color.grey};
    font-size: 12px;
    line-height: 24px;
    letter-spacing: 0.3px;
    margin-bottom: 0;
`;


