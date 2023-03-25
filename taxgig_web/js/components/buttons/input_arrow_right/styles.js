import styled from "styled-components";
import { color, f_c_sb } from '../../styles';

export const InputContainer = styled.div`
    ${f_c_sb};
	background-color: ${color.white};
    box-shadow: 0px 16px 25px #292F42;
    border-radius: 4px;
    cursor: pointer;
    padding: 0 16px;
    height: 48px;
`;

export const Input = styled.input`
    font-family: 'SF Pro Display';
    font-weight: 500;
    color: ${color.black};
    margin-right: 10px;
    width: 100%;
    border: 0;
    transition: .3s;

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

export const InputLink = styled.div`
   
`;
