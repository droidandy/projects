import styled from "styled-components";

import { device, color } from "../../../../../components/styles";

export const Section = styled.div`
    padding-top: 72px;
    padding-bottom: 72px;
    @media ${device.laptop} {
        padding-top: 72px;
        padding-bottom: 84px;
    }
`;

export const ReadySectionTitle = styled.h2`
    //font-family: Roboto-Bold;
    text-align: center;
    color: ${color.green};
    font-size: 40px;
    line-height: 58px;
    font-weight: 900;
    letter-spacing: 1px;
    @media ${device.laptop} {
        font-size: 40px;
    }
`;

export const BlockBtn = styled.div`
    position: relative;
    width: 100%;
    margin: 0 auto 72px;
    max-width: 138px;
    height: 56px;
    @media ${device.laptop} {
        margin: 0 auto 84px;
    }
`;