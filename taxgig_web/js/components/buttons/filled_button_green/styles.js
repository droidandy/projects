import styled from "styled-components";
import { color, f_c_c } from '../../styles';

import { NavLink } from 'react-router-dom';

export const Button = styled(NavLink)`
    ${f_c_c};
	background-color: ${color.green};
    border-radius: 4px;
    cursor: pointer;
    padding: 0 0px;
    height: 40px;
    width: 130px;
    text-decoration: none;
    transition: .3s;

    // For header
    font-size: 14px;
    margin-right: 15px;
    margin-left: 50px;

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
    font-family: 'SF Pro Display';
    font-weight: 500;
    color: #fff;
    font-size: 14px;
    line-height: 24px;
`;
