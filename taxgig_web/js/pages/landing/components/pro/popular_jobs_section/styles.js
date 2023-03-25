import styled from "styled-components";

import {
	color,
	device,
	f_c_sb,
	wShadow,
	transition
} from "../../../../../components/styles";

export const Section = styled.div`
	padding-top: calc(104px + 83px);

	@media ${device.laptop} {
		padding-top: 104px;
	}
`;

export const CardsWrapper = styled.div`
	margin-top: 56px;
`;

export const SwiperCard = styled.div`

`;

export const Card = styled.div`
	width: 282px;
	width: 100%;
	box-sizing: border-box;
	margin: 0 auto 0;

	${transition};

	@media ${device.tillLaptop} {
		margin: 0 auto;
		max-width: 364px;
		width: 100% !important;
	}

`;

export const CardContent = styled.div`
	border-radius: 10px;
	background-color: #fff;
`

export const CardImg = styled.div`
    padding: 32px;
    height: 56px;
`;

export const CardTitle = styled.div`
	color: ${color.black};
    font-weight: 500;
    padding: 0 32px;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0.5px;
`;

export const CardSubtitleWrapper = styled.div`
	display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 32px 32px;
`;

export const CardPaginationWrapper = styled.div`
	height: 40px;
	display: block;

	@media ${device.laptop} {
		display: none;
	}
`;


export const CardSubtitle = styled.div`
	color: ${color.darkGrey};
	font-size: 12px;
    line-height: 24px;
    letter-spacing: 0.3px;
`;

export const CardPrice = styled.div`
	color: ${color.green};
	font-weight: 700;
`;




