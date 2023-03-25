import styled from "styled-components";

import { color, device, f_c_sb } from "../../../../../components/styles";

export const Section = styled.div`
	padding-top: 72px;

	@media ${device.laptop} {
		padding-top: 104px;
	}
`;

export const AdvantagesList = styled.ul`
	display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-width: 804px;
    width: 100%;
    margin: 56px auto 0;

    @media ${device.laptop} {
		max-width: inherit;
    	width: inherit;
`;

export const AdvantagesItem = styled.li`
	margin: 0 auto 64px;
    max-width: 450px;
    width: 100%;
    display: flex;
    justify-content: space-between;

    &:last-child {
			margin: 0 auto;
		}
   
	@media ${device.laptop} {
		max-width: 373px;
	}
`;

export const AdvantagesImageContainer = styled.div`
	width: 56px;
    margin-right: 35px;
        margin: 1em;
`;

export const AdvantagesTitle = styled.h3`
	color: ${color.black};
    font-weight: 600;
	regular-title {
    font-size: 18px;
    line-height: 30px;
    font-weight: 600;
    letter-spacing: 0.5px;

`

export const AdvantagesText = styled.p`
	margin-top: 8px;
    color: ${color.darkGrey};
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0.5px;
`




