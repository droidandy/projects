import styled from "styled-components";

import { color, device, f_c_sb } from "../../../../../components/styles";

export const Section = styled.div`
	margin-top: 32px;

     @media ${device.laptop} {
        margin-top: 56px;
     }
`;


export const PolicyBlock = styled.div`
    margin: 0 auto 72px;
    max-width: 588px;
    width: 100%;

    @media ${device.laptop} {
        margin: 0 auto 104px;
        max-width: 728px;
    }
`

export const PolicyParagraph = styled.div`
    margin-bottom: 30px;
    font-family: SF Pro Display;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 26px;
    color: #626B7E;

    &:last-child {
        margin-bottom: 0;
    }
`

export const LeftNavigation = styled.div`
    max-width: 66%;
`

export const RightContent = styled.div`
    
`

export const StaticBlockContainer = styled.div`
    display: flex;
    flex-direction: column;
`

export const StaticSubTitle = styled.div`
    font-weight: 600;
    line-height: 1.5rem;
    font-size: .875rem;
    text-align: center;
    letter-spacing: .3px;
    text-transform: uppercase;
    color: rgba(179,179,198,.7);
    opacity: .8;
`

export const StaticBlockContent = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    
    @media ${device.tillLaptop} {
       flex-direction: column;
       align-items: center;
    }
`

export const NavLink = styled.div`
    margin-bottom: 1rem;
    font-weight: 400;
    line-height: 1.5rem;
    font-size: 1rem;
    letter-spacing: .3px;
    color: #6f7583;
    text-decoration: none;
    padding-right: 20px;
    
    &:hover {
        cursor: pointer;
        opacity: .7;
    }
    
    @media ${device.tillLaptop} {
        text-align: center;
    }
`
