import styled from "styled-components";

import { color, device, f_sb } from "../../../../../components/styles";

export const Section = styled.div`
    ${f_sb};
    position: relative;
    z-index: 2;
    padding-top: 32px;
    flex-direction: column;


    @media ${device.laptop} {
        padding-top: 72px;
        padding-bottom: 104px;
        flex-direction: row;
    }
`;

export const AboutLeftBlock = styled.div`
    width: 100%;
    max-width: 650px;
    margin: 0 auto;

    @media ${device.laptop} {
        max-width: 486px;
        margin-left: 102px;
    }
`;

export const AboutRightBlock = styled.div`
    padding-left: 32px;
    width: 100%;
    margin: 32px auto 72px;
    vertical-align: middle;

    @media ${device.laptop} {
        width: 50%;
    }
`;

export const AboutText = styled.div`
    margin-top: 24px;
`;

export const AboutParagraph = styled.p`
    margin-bottom: 16px;
    font-family: SF Pro Display;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 26px;
    color: #626B7E;
    letter-spacing: 0.3px;

    &:last-child {
        margin-bottom: 0;
    }

`