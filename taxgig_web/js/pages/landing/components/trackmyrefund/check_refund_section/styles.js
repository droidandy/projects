import styled from "styled-components";

import {
	color,
	device,
	f_sb
} from "../../../../../components/styles";

export const Section = styled.div`
	${f_sb};
	position: relative;
	z-index: 2;
	padding-top: 92px;
	padding-left: 0;
	flex-direction: column;
	@media ${device.laptop} {
		padding-top: 155px;
		padding-left: 32px;
		flex-direction: row;
	}
`;

export const LeftBlock = styled.div`
	width: 100%;
	max-width: 650px;
	margin: 0 auto;
	min-height: 413px;
	@media ${device.laptop} {
		max-width: 496px;
		width: 34%;
		margin-left: 12%;
	}
`;

export const LeftBlockTitle = styled.h1`
	//font-family: Roboto-Bold;
	color: ${color.green};
	font-size: 38px;
	line-height: 60px;
	font-weight: 900;
	letter-spacing: 1.5px;
`;

export const LeftBlockText = styled.p`
	margin-top: 16px;
	color: ${color.darkGrey};
	font-size: 14px;
	line-height: 24px;
	letter-spacing: 0.3px;
	margin-bottom: 40px;
	@media ${device.laptop} {
		font-size: 16px;
		line-height: 26px;
	}
`;

export const RightBlock = styled.div`
	vertical-align: middle;
	transform: scale(1.3);
	margin-bottom: 60px;
	@media ${device.laptop} {
		margin-bottom: 0px;
		transform: scale(1);
		width: 50%;
	}
`;