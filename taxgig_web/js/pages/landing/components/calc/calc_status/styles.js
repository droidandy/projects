import styled from "styled-components";

import { color, device, f_c_sb } from "../../../../../components/styles";

export const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0 24px;
    margin: 16px auto 0;
    position: relative;
    border: ${props => (props.isActive == 'yes' ? `1px solid ${color.green}` : "1px solid #D4D4E4" )};
    box-sizing: border-box;
    border-radius: 5px;
    height: 64px;

    &:hover {
        border: 1px solid ${color.green};
    }
`;

export const ContainerImage = styled.div`
    display: ${props => (props.isImageVisible ? "block" : "none" )};
    margin-right: 24px;
`; 

export const StatusTitle = styled.p`
    font-size: 14px;
    line-height: 64px;
    margin: 0;
    letter-spacing: 0.3px;
    color: ${color.darkGrey};
`;

export const ContainerInfo = styled.div`
    position: absolute;
    right: 17px;
    top: 25px;
    display: ${props => (props.isHintVisible ? "block" : "none" )};
`;


export const GreenBorder = styled.div`
    
`; 

export const ContainerHint = styled.div`
    z-index: 99;
    padding: 16px;
    background: ${color.black};
    border-radius: 4px;
    cursor: unset;
    position: absolute;
    display: block;
    width: 77%;
    top: 48%;
    right: 14%;
    transform: translate(0, -50%);
    box-sizing: border-box;

    &:before {
        position: absolute;
        content: '';
        height: 10px;
        width: 10px;
        display: block;
        background: ${color.black};
        transform: rotate(45deg);
        top: 49%;
        right: -5px;
    }

    @media ${device.mobileL} {
       right: 10%;
    }

    @media ${device.laptop} {
       right: -102%;
       width: 100%;

       &:before {  
            left: -5px;
        }
    }
`;

export const HintText = styled.p`
    margin: 0;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.5px;
    color: #E5E5F6;
`;


