import styled from "styled-components";
import { color, f_c_c, f_cy } from "../../styles";

export const ContainerButton = styled.div`
    ${f_c_c};
    border-radius: 10px;
    width: fit-content;
    margin: 0 auto;
    align-items: stretch;
`;

export const ButtonIncome = styled.button`
    ${f_c_c};
    font-family: "SF Pro Display", sans-serif;
    font-weight: 500;
    color: #fff;
    background-color: ${color.green};
    border: none;
    cursor: pointer;
    font-size: 14px;
    line-height: 24px;
    z-index: 1;
    transition: .3s;
    padding: 16px 24px;
    border-radius: 10px 0 0 10px;

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

export const ButtonBusiness = styled.button`
    ${f_c_c};
    font-family: "SF Pro Display", sans-serif;
    font-weight: 500;
    color: ${props => props.isActive ? color.white : color.black};
    background-color: ${props => props.isActive ? color.green : color.white};
    border: none;
    cursor: pointer;
    font-size: 14px;
    line-height: 24px;
    z-index: 1;
    transition: .3s;
    padding: 16px 24px;

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

export const ButtonSales = styled.button`
    ${f_c_c};
    font-family: "SF Pro Display", sans-serif;
    font-weight: 500;
    color: #fff;
    background-color: ${color.green};
    border: none;
    cursor: pointer;
    font-size: 14px;
    line-height: 24px;
    z-index: 1;
    transition: .3s;
    padding: 16px 24px;
    border-radius: 0 10px 10px 0;

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

