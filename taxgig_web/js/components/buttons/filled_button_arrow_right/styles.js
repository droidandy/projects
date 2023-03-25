import styled from "styled-components";
import { color, f_c_c } from '../../styles';

export const Button = styled.a`
    ${f_c_c};
	background-color: ${color.green};
    border-radius: 4px;
    cursor: pointer;
    padding: 0 16px;
    height: 48px;
    text-decoration: none;
    transition: .3s;

    // For header
    font-size: 14px;

    &:hover {
        background-color: #5CA612;
    }

    &:active {
        background-color: #58A10F;
    }

    &:disabled {
        background-color: #ECEDFA;
        color: ##B8B4CC;
`;

export const ButtonText = styled.div`
    font-family: 'SF Pro Display';
    font-weight: 500;
    color: ${color.white};
    margin-right: 20px;
`;
