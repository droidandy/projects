import styled from "styled-components";
import { color, f_c_c } from '../../styles';

import { NavLink } from 'react-router-dom';

export const Button = styled(NavLink)`
    ${f_c_c};
	background-color: transparent;
    border: 1px solid ${color.green};
    border-radius: 4px;
    cursor: pointer;
    padding: 0 16px;
    height: 38px;
    min-width: 86px;
    text-decoration: none;
    transition: .3s;
    // For header
    font-size: 14px;
    &:hover {
        background-color: rgba(97, 173, 21, 0.05);
    }
    &:active {
        background-color: rgba(97, 173, 21, 0.1);
    }

    &:disabled {
        background-color: transparent;
        color: ${color.greenDisabled};
        border: 1px solid #ECEDFA;
`;

export const ButtonText = styled.div`
    font-family: 'SF Pro Display';
    font-weight: 500;
    color: ${color.green};
    margin-right: 10px;
`;
