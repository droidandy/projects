import styled from "styled-components";

import { color, device, f_c_sb, hShadow, transition } from "../../../../../components/styles";

export const Section = styled.div`
`;

export const FaqListBlock = styled.div`
    margin: 0 auto;
    flex-direction: column;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

     @media ${device.laptop} {
        margin: 0;
        flex-direction: row;
    }
`;





