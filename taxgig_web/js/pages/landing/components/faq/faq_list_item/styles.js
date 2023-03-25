import styled from "styled-components";

import { color, device, f_c_sb, transition } from "../../../../../components/styles";

export const FaqItem = styled.div`
    display: flex;
    margin: 0 auto 24px;
    background: ${props => (props.background == 'white' ? "#fff" : "#F3F6FC" )};
    box-shadow: ${props => (props.shadow == 'yes' ? "0px 5px 10px rgba(131, 139, 164, 0.07)" : "none" )};
    font-family: SF Pro Display;
    border-radius: 10px;
    max-width: 588px;
    width: 100%;
    padding: 32px;
    box-sizing: border-box;
    ${transition};

    &:hover {
        box-shadow: ${props => (props.hover == 'yes' ? '8px 20px 30px rgba(98, 107, 126, 0.1)' : "" )};
        cursor: ${props => (props.hover == 'yes' ? "pointer" : "" )};
    }

    &:last-child{
        margin-bottom: 0; 
    }

    @media ${device.laptop} {
        max-width: 790px;
    }
`;

export const FaqBlockLeft = styled.div`
   padding-right: 30px;
`;

export const FaqBlockRight = styled.div`
`;

export const FaqItemHeader = styled.h4`
    font-weight: bold;
    font-size: 18px;
    line-height: 30px;
    color: #292F42;
`;

export const FaqItemDescription = styled.p`
    margin-top: 8px;
    font-size: 14px;
    line-height: 24px;
    color: #626B7E;
`;

export const FaqItemText = styled.p`
    font-size: 12px;
    line-height: 24px;
    color: #B5B5D0;
`;







