import styled from "styled-components";
import { color, device, f_c_c } from '../../styles';

export const Title = styled.h1`
    font-size: 26px;
    line-height: 58px;
    font-weight: bold;
    letter-spacing: 1px;
    color: ${color.green};
    text-align: center;

    @media ${device.tablet} {
        font-size: 40px;
    }
`;

export const Subtitle = styled.div`
    font-size: 16px;
    line-height: 31px;
    letter-spacing: 0.3px;
    color: ${props => props.dark ? color.grey : color.darkGrey};
    margin-top: 4px;
    text-align: center;
    max-width: 588px;
    margin: 0 auto;
    width: 100%;
`;
