import styled from "styled-components";

import { color, device, f_sb } from "../../../../../components/styles";

export const Section = styled.div`
    ${f_sb};
    position: relative;
    z-index: 2;
    flex-direction: column;
`;

export const CalendlyContainer = styled.div`
    width: 100%;
    // max-width: 650px;
    margin: 0 auto;

    // @media ${device.laptop} {
    //     max-width: 486px;
    //     margin-left: 102px;
    // }
`;