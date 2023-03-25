import styled, { keyframes } from "styled-components";
import { color, f_c_c, f_cy, transition, wShadow } from "../../../../components/styles";

const AppearAnimation = keyframes`
  0% { width: 356px; }
  100% { width: 56px; }
`;

const DisppearAnimation = keyframes`
    0% { width: 56px; }
  100% { width: 356px; }
`;

export const Button = styled.button`
    ${f_c_c};
    font-family: "SF Pro Display";
    font-weight: 500;
    color: #fff;
    background-color: ${color.green};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    ${f_cy};
    ${transition};
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    max-width: ${props => (props.showInput ? "56px" : "356px")};
    padding: ${props => (props.showInput ? "0" : "0 25px")};
    height: 56px;
    font-size: 14px;
    line-height: 24px;
    color: #fdfdfd;
    z-index: 1;
    text-transform: lowercase;
    transition: .3s;

    &::first-letter {
        text-transform: capitalize;
    }

    &:hover {
        background-color: ${color.greenHover};
    }

    &:active {
        background-color: ${color.greenActive};
    }

    &:disabled {
        background-color: #ecedfa;
        color: #b5b5d0;
    }

    animation: ${props =>
        (props.showInput) 
            ? AppearAnimation
            : DisppearAnimation} 0.4s ease-in-out;
`;

export const ButtonText = styled.div`
    font-family: "SF Pro Display";
    font-weight: 500;
    color: ${color.green};
    margin-right: 10px;
`;

export const Input = styled.input`
    ${wShadow};
    width: 100%;
    position: relative;
    border: 1px solid #e8ebef;
    padding: 15px 93px 16px 24px;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 24px;
    color: ${color.black};
    border-radius: 4px;

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

export const ImageContainer = styled.div`
    height: 56px;
    width: 56px;
    line-height: 56px;
 
`;

const RotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const SpinningImageContainer = styled.div`
    height: 56px;
    width: 56px;
    line-height: 56px;
    animation: ${RotateAnimation} 2s linear infinite;;
`;


