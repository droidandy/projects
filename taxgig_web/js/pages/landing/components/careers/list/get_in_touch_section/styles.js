import styled from "styled-components";

import { color, device, f_c_sb } from "../../../../../../components/styles";

export const Section = styled.div`
	padding-top: 72px;
    padding-bottom: 72px;

    @media ${device.laptop} {
        padding-top: 104px;
        padding-bottom: 104px;
     }
`;

export const ContainerButton = styled.div`
    margin: 0 auto;
    max-width: 158px;
    margin-top: 32px;
	width: 100%;

     @media ${device.laptop} {
        margin-top: 56px;
    }
`;






