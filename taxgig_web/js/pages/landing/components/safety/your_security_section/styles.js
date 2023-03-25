import styled from "styled-components";

import { color, device, f_c_sb } from "../../../../../components/styles";

export const Section = styled.div`
	padding: 80px 0 72px;
    @media ${device.laptop} {
        padding: 104px 0;
    }

`;

export const YourSecurityBlock = styled.ul`
    max-width: 588px;
	display: flex;
    justify-content: space-between;
    margin: 0 auto;
    flex-wrap: wrap;
    list-style: none;

    @media ${device.laptop} {
        max-width: 696px;
        flex-direction: row;   
    }

    @media ${device.laptopL} {
        max-width: unset;
        flex-direction: row;   
    }
`;

export const YourSecurityBox = styled.li`
    text-align: center;
    margin: 32px auto 0;
	max-width: 382px;
    width: 100%;

    @media ${device.laptop} {
        margin-top: 56px;
        max-width: 282px;
        flex-direction: row;
    }
`;

export const YourSecurityTitle = styled.h3`
    margin-top: 24px;
    color: #292F42;
    font-size: 18px;
    line-height: 30px;
    font-weight: 600;
    letter-spacing: 0.5px;
`;

export const YourSecurityText = styled.p`
	margin-top: 8px;
    color: #626B7E;;
    text-align: center;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0.5px;
`;


