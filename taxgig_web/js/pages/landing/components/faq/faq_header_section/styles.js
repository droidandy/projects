import styled from "styled-components";

import { color, device, f_c_sb } from "../../../../../components/styles";

export const Section = styled.div`
	padding-top: 32px;
    padding-bottom: 32px;

     @media ${device.laptop} {
        padding-top: 56px;
        padding-bottom: 32px;
     }
`;

export const SearchBox = styled.form`
    position: relative;
    padding-top: 24px;
    margin: 0 auto;
    max-width: 588px;
    width: 100%;

     @media ${device.laptop} {
        max-width: 790px;
        padding-top: 56px;
    }
`;

export const SearchImage = styled.div`
    margin-left: 14px;
    margin-top: 12px;
    position: absolute;
    display: block;
    cursor: pointer;
`;

export const SearchInput = styled.input`
    padding-left: 48px;
    width: 100%;
    height: 48px;
    background: #FFFFFF;
    border: 1px solid #E8EBEF;
    box-sizing: border-box;
    border-radius: 5px;
	font-family: SF Pro Display;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    color: #626B7E;

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



