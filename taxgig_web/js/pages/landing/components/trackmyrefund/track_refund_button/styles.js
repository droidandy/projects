import styled from "styled-components";
import { color, f_c_c } from '../../../../../components/styles';

import { NavLink } from 'react-router-dom';

export const Button = styled.a`
    ${f_c_c};
	background-color: ${color.green};
    // border: 1px solid ${color.green};
    border-radius: 4px;
    cursor: pointer;
    padding: 0 16px;
    height: 48px;
    width: 138px;
    text-decoration: none;
    transition: .3s;

    // For header
    font-size: 14px;
    margin-right: 15px;

    &:hover {
        background-color: ${color.greenHover};
    }
    &:active {
        background-color: ${color.greenActive};
    }
    &:disabled {
        background-color: transparent;
        color: ${color.greenDisabled};
        border: 1px solid #ECEDFA;
`;

export const ButtonText = styled.div`
    //font-family: 'Roboto';
    font-weight: 400;
    color: #fff;
    font-size: 16px;
    line-height: 26px;
`;
