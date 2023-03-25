import styled from "styled-components";

import { color, device, f_c_sb } from "../../../../../components/styles";

export const Section = styled.div`
	padding-top: 72px;

	@media ${device.laptop} {
		padding-top: 104px;
	}
`;

export const WhyJoinList = styled.ul`
	display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-width: 804px;
    width: 100%;
    margin: 46px auto 0;
    list-style: none;

    @media ${device.laptop} {
        margin: 56px auto 0;
		max-width: inherit;
    	width: inherit;
        flex-wrap: nowrap;
`;

export const WhyJoinItem = styled.li`
    text-align: center;
	margin: 0px auto 36px;
    max-width: 450px;
    width: 100%;

    &:last-child {
			margin: 0 auto;
		}
   
	@media ${device.laptop} {
		max-width: 282px;
	}
`;

export const WhyJoinImageContainer = styled.div`
	width: 56px;
    margin: 0 auto 21px;
`;

export const WhyJoinTitle = styled.h3`
	color: ${color.white};
    font-weight: 600;
	regular-title {
    font-size: 18px;
    line-height: 30px;
    font-weight: 600;
    letter-spacing: 0.5px;

`

export const WhyJoinText = styled.p`
	margin-top: 8px;
    color: ${color.grey};
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0.5px;
`




