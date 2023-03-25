import styled from "styled-components";

import { color, device, f_c_sb } from "../../../../../../components/styles";

export const Section = styled.div`
	padding-top: 24px;

     @media ${device.laptop} {
        padding-top: 112px;
     }
`;

export const CareersListBlock = styled.div`
    margin: 0 auto;
    flex-direction: column;
    padding-top: 24px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

     @media ${device.laptop} {
        padding-top: 56px;
        margin: 0;
        flex-direction: row;
    }
`;





