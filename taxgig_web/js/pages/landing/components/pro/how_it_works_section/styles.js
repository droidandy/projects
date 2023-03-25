import styled from "styled-components";

import {
	LandingWrapperPadding,
	color,
	device,
	f_sb,
	f_c_sb,
	wShadow
} from "../../../../../components/styles";


// How it works section (home/pro pages)

export const HowItWorksContainer = styled.div`
	margin-top: 72px;

	@media ${device.laptop} {
		padding-top: 104px;
	}
`;

export const StepsBlock = styled.ul`
	margin-top: 56px;

	@media ${device.laptop} {
		padding: 0 64px;
	}
`;

export const Step = styled.li`
	${f_c_sb};
	flex-wrap: wrap;

	${props => (props.reverse ? "flex-direction: row-reverse" : null)};

	@media ${device.tillLaptop} {
		flex-direction: column-reverse;
		justify-content: center;
		margin-bottom: 104px;
		${props => (props.reverse ? "flex-direction: column-reverse" : null)};
	}

	&:last-child {
		margin-bottom: 0;
	}
`;

export const StepContent = styled.div`
	max-width: 392px;
	width: 100%;

	@media ${device.tillLaptop} {
		max-width: 588px;
		margin-top: 24px;
	}
`;

export const StepHelper = styled.div`
	font-size: 12px;
	line-height: 20px;
	text-transform: uppercase;
	letter-spacing: 0.3px;
	color: ${color.grey};
`;

export const StepTitle = styled.h3`
	color: ${color.white};
	margin-top: 16px;
	max-width: 330px;
	width: 100%;
	font-size: 24px;
	font-weight: 600;
	line-height: 40px;
	letter-spacing: 0.5px;
`;

export const StepText = styled.div`
	color: ${color.grey};
	margin-top: 16px;
	font-size: 14px;
	line-height: 26px;
	letter-spacing: 0.5px;
`;

export const StepImageContainer = styled.div`
	max-width: 588px;
	width: 100%;

	@media ${device.laptop} {
		width: 50%;
	}
`;

export const BlockBtn = styled.div`
	position: relative;
    width: 100%;
    margin: 48px auto 106px;
    max-width: 356px;

    @media ${device.laptop} {
       margin: 32px 0 0 0;
    }
`;
