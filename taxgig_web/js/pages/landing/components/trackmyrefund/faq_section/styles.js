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
	padding-top: 0px;
	flex-direction: column;
	@media ${device.laptop} {
		padding-top: 72px;
		flex-direction: row;
		padding-left: 32px;
		padding-right: 32px;
	}
`;

export const LeftBlock = styled.div`
	width: 100%;
	max-width: 650px;
	margin: 0 auto;
	min-height: 370px;
	@media ${device.laptop} {
		max-width: 496px;
		margin-left: 0px;
		min-height: 413px;
	}
`;

export const LeftBlockTitle = styled.h1`
	//font-family: Roboto-Bold;
	color: ${color.green};
	font-size: 38px;
	font-weight: 900;
	line-height: 60px;
`;

export const LeftBlockText = styled.p`
	margin-top: 16px;
	color: ${color.darkGrey};
	font-size: 16px;
	line-height: 31px;
	letter-spacing: 0.3px;
`;

export const LeftBlockBtn = styled.div`
	margin-top: 48px;
	max-width: 356px;
	width: 100%;
	position: relative;
	height: 56px;
`;

export const RightBlock = styled.div`
	vertical-align: middle;
	text-align: right;
	text-align: center;
	@media ${device.laptop} {
		text-align: right;
	}
`;
