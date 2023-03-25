import styled from "styled-components";

import { device, color, f_c_sb } from "../../../../../components/styles";

export const Section = styled.div`
    padding-top: 72px;
    padding-bottom: 72px;

    @media ${device.laptop} {
        padding-top: 104px;
        padding-bottom: 96px;
    }
`;

export const ReadySectionTitle = styled.h2`
    padding-bottom: 24px;
    text-align: center;
    color: ${color.green};
    font-size: 26px;
    line-height: 58px;
    font-weight: bold;
    letter-spacing: 1px;

    @media ${device.laptop} {
        padding-bottom: 56px;
        font-size: 40px;
    }
`;

export const BlockBtn = styled.div`
    position: relative;
    width: 100%;
    margin: 0 auto 72px;
    max-width: 356px;
    height: 56px;

    @media ${device.laptop} {
        margin: 0 auto 84px;
    }
`;