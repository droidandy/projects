import styled from "styled-components";
import { color, f_c_c, f_cy } from "../../styles";

export const Button = styled.button`
    ${f_c_c};
    font-family: "SF Pro Display";
    font-weight: 500;
    color: #fff;
    background-color: ${color.green};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 0 16px;
    height: 48px;
    ${f_cy};
    display: block;
    padding: 0 25px;
    height: 56px;
    font-size: 14px;
    line-height: 24px;
    color: #fdfdfd;
    z-index: 1;
    text-transform: capitalize;
    margin: 0 auto 0;
    min-width: 165px;
    width: 100%;
    margin-top: 15px;
    transition: .3s;

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
`;

