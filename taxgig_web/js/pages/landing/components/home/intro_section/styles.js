import styled from "styled-components";

import {
	LandingWrapperPadding,
	color,
	device,
	f_sb,
	f_c_sb,
	wShadow
} from "../../../../../components/styles";

export const Section = styled.div`
	${f_sb};
	position: relative;
	z-index: 2;
	padding-top: 72px;

	@media ${device.laptop} {
		padding-top: 72px;
	}
`;

export const LeftBlock = styled.div`
	width: 100%;
	max-width: 650px;
	margin: 0 auto;
	min-height: 413px;

	@media ${device.laptop} {
		max-width: 496px;
		margin-left: 102px;
	}
`;

export const LeftBlockTitle = styled.h1`
	color: ${color.black};
	font-size: 48px;
	font-weight: 900;
	line-height: 76px;
	letter-spacing: 1.5px;
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
`;