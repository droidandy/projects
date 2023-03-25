import styled from "styled-components";

import { color, device, f_c_sb } from "../../../../../components/styles";

export const Container = styled.div`
    margin: 12px auto 0;
    position: relative;
    box-sizing: border-box;
    height: 64px;
`;

export const InputTitle = styled.p`
    margin: 0;
    font-family: SF Pro Display;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 20px;
    color: #9090AB;
`;


export const ContainerInfo = styled.div`
    position: absolute;
    right: 17px;
    top: 15px;
`;

export const Input = styled.input`
    width: 100%;
    border: none;
    border-bottom: 0.5px solid #B5B5D0;
    font-family: SF UI Display;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 26px;
    color: ${color.black};

     &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 30px white inset !important;
    }

    &:-webkit-autofill:hover {
        -webkit-box-shadow: 0 0 0 30px white inset !important;
    }

    &:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 30px white inset !important;
    }

    &:-internal-autofill-selected {
        background-color: ${color.white};
    }
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
    top: 32%;
    transform: translate(0, -50%);
    right: 14%;
    box-sizing: border-box;

    &:before {
        top: 49%;
        right: -5px;
        position: absolute;
        content: '';
        height: 10px;
        width: 10px;
        display: block;
        background: ${color.black};
        transform: rotate(45deg);
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

