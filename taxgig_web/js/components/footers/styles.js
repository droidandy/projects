import styled from "styled-components";
import { device, color, f_c_sb, f_sb } from "../styles";
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

export const Footer = styled.div`
	background-color: ${color.black};
    border-top: 8px solid #61AD15;
`;

export const FooterWrapper = styled.div`
    max-width: 1200px;
    width: 100%;
    padding: 0 32px;
    margin: 72px auto 0;
    font-family: 'SF Pro Display';
    box-sizing: border-box;
    flex-direction: column;
    ${f_sb};

    @media ${device.laptop} {
        flex-direction: row;
		 margin: 72px auto;
    }
`;

export const FooterRemark = styled.div`
	text-transform: uppercase;
    text-align: center;
    padding: 16px 0;
    border-top:  1px solid ${props => (props.color == 'grey' ? color.lightGrey : "#202535" )};
    font-family: 'SF Pro Display';
    color: ${props => (props.color == 'grey' ? color.grey : "#fff" )};
    font-size: 12px;
    line-height: 24px;
    letter-spacing: 0.3px;
`;

export const FooterRemarkLink = styled.a`
	color: ${color.green};
    text-decoration: none;
    transition: .3s;
`;

export const FooterInfoContainer = styled.div`
    flex-direction: row;
    display: flex;
    justify-content: space-between;
`

export const FooterLeft = styled.div`
    max-width: 383px;
    width: 100%;
`

export const LogoLink = styled.a`
   display: inline-block;
   cursor: pointer;
`

export const FooterText = styled.p`
    color: #fff;
    margin-top: 16px;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0.5px;
`

export const DivContainer = styled.div`
`

export const InputTitle = styled.h4`
    color: #fff;
    margin: 40px 0 16px;
    font-size: 18px;
    line-height: 30px;
    font-weight: 600;
    letter-spacing: 0.5px;

     @media ${device.laptop} {
        margin: 64px 0 16px;
    }
`