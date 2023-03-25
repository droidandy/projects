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
	padding-top: 45px;
	flex-direction: column;
	@media ${device.laptop} {
		padding-top: 102px;
		flex-direction: row;
	}
`;

export const LeftBlock = styled.div`
	width: 100%;
	max-width: 650px;
	min-height: 374px;
	@media ${device.laptop} {
		max-width: 496px;
		padding-left: 32px;
		min-height: 413px;
	}
`;

export const LeftBlockTitle = styled.h1`
	//font-family: Roboto-Bold;
	color: ${color.black};
	font-weight: 900;
	font-size: 48px;
	line-height: 60px;
	margin: 0px;
	@media ${device.laptop} {
		font-size: 62px;
		line-height: 76px;
	}
`;

export const LeftBlockText = styled.p`
	margin-top: 16px;
	color: ${color.darkGrey};
	font-size: 16px;
	line-height: 26px;
	margin-bottom: 42px;
`;

export const RightBlock = styled.div`
	vertical-align: middle;
	text-align: center;
	@media ${device.laptop} {
		text-align: right;
	}
`;