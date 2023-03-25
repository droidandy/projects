import styled, { keyframes } from "styled-components";

import {
	color,
	device
} from "../../../../../components/styles";

export const Section = styled.div`
	padding-top: calc(75px);
	@media ${device.laptop} {
		padding-top: 50px;
	}
`;

export const SectionTitle = styled.div`
	//font-family: Roboto-Bold;
	font-weight: 900;
	font-size: 38px;
	line-height: 60px;
	text-align: center;
	color: #61AD15;
	@media ${device.laptop} {
		font-size: 38px;
		line-height: 60px;
	}
`;

export const SectionSubTitle = styled.div`
	//font-family: Roboto;
	font-size: 16px;
	line-height: 31px;
	display: flex;
	align-items: center;
	text-align: center;
	color: #626B7E;
	display: block;
	@media ${device.laptop} {
		font-size: 16px;
		line-height: 26px;
		margin-bottom: 15px;

	}
`;


export const breatheAnimation = keyframes`
 0% {  }
 20% {  transform: translateX(0px); opacity: .5; filter: grayscale(1);}
 40% {  transform: translateX(0px); opacity: .5; filter: grayscale(1);}
 100% {opacity: 1; filter: grayscale(0); transform: translateX(0px);}
`
export const arrowAnimation = keyframes`
 0% {  }
 20% {  transform: translateX(0px); opacity: .5; filter: grayscale(1);}
 40% {  transform: translateX(0px); opacity: .5; filter: grayscale(0);}
 100% {opacity: 1; filter: grayscale(0); transform: translateX(0px);}
`
export const arrowAnimationDown = keyframes`
 0% {  }
 20% {  transform: translateX(0px) rotate(90deg); opacity: .5; filter: grayscale(1);}
 40% {  transform: translateX(0px) rotate(90deg); opacity: .5; filter: grayscale(0);}
 100% {opacity: 1; filter: grayscale(0); transform: translateX(0px) rotate(90deg);}
`


export const CardsWrapper = styled.div`
	margin-top: 38px;

	@media ${device.tillLaptop} {
		margin-left: 0;
	}
`;

export const CardsContainer = styled.div`
	display: none;
	justify-content: space-between;
	max-width: 1200px;
	width: 100%;
	padding: 0;
	margin: 0 auto;
	flex-direction: column;
	@media ${device.laptop} {
		flex-direction: row;
		padding: 0 32px;
	}
`;

export const CardNumber = styled.div`
	font-weight: 700;
	font-size: 48px;
	line-height: 64px;
	letter-spacing: 1.5px;
	color: ${color.green};
	@media ${device.laptop} {
		font-weight: 800;
	}
`;

export const CardTitle = styled.div`
	font-weight: bold;
	font-size: 24px;
	line-height: 40px;
	letter-spacing: 0.5px;
	text-transform: capitalize;
	color: #292F42;
	margin: 8px 0px;
`;

export const CardSubtitleWrapper = styled.div`
	display: flex;
    align-items: center;
    justify-content: space-between;
		padding: 16px 32px 32px;
		align-self: end;
`;

export const CardPaginationWrapper = styled.div`
	display: none;
`;


export const CardSubtitle = styled.div`
	color: ${color.darkGrey};
	font-size: 12px;
    line-height: 24px;
    letter-spacing: 0.3px;
`;

export const Card = styled.div`
	transform: translateX(-100px);
	opacity: 0;
	filter: grayscale(1);
	width: 282px;
	width: 100%;
	margin: 0 auto;
	height: 100%;
	max-width: unset;
	animation: ${breatheAnimation} 2.5s linear 1s forwards;
	@media ${device.tillLaptop} {
		margin: 0 auto;
		width: 100% !important;
	}
	@media ${device.laptop} {
		max-width: 364px;
	}
`;

export const Card2 = styled.div`
	transform: translateX(-100px);
	opacity: 0;
	filter: grayscale(1);
	width: 282px;
	width: 100%;
	box-sizing: border-box;
	margin: 0 auto;
	height: 100%;
	animation: ${breatheAnimation} 3s linear 1.5s forwards;
	@media ${device.tillLaptop} {
		margin: 0 auto;
		width: 100% !important;
	}
	@media ${device.laptop} {
		max-width: 364px;
	}
`;

export const Card3 = styled.div`
	transform: translateX(-100px);
	opacity: 0;
	filter: grayscale(1);
	width: 282px;
	width: 100%;
	box-sizing: border-box;
	margin: 0 auto;
	height: 100%;
	animation: ${breatheAnimation} 3.5s linear 2s forwards;
	@media ${device.tillLaptop} {
		margin: 0 auto;
		width: 100% !important;
	}
	@media ${device.laptop} {
		max-width: 364px;
	}
`;

export const CardContent = styled.div`
	display: flex;
	max-width: 314px;
	flex-direction: column;
	border-radius: 10px;
	height: 100%;
	margin-bottom: 25px;
	@media (max-width: 1023px) {
		border-radius: 10px;
	    margin: 0 0 30px;
	}
	@media ${device.laptop} {
		margin-bottom: unset;
	}
`

export const ArrowNext = styled.div`
// transform: translateX(-100px);
opacity: 0;
filter: grayscale(1);
font-weight: 700;
width: 40px;
border-radius: 50%;
display: flex;
height: 40px;
align-items: center;
justify-content: center;
background: ${color.green};
transform: translateX(-100px) rotate(90deg);
animation: ${arrowAnimationDown} 3s linear 1.25s forwards;
transform: translateX(-100px) rotate(90deg);
margin-bottom: 20px;
@media ${device.laptop} {
	margin: auto 24px;
	transform: translateX(-100px) rotate(0deg);
	animation: ${arrowAnimation} 3s linear 1.25s forwards;

}
`;

export const ArrowNext2 = styled.div`
transform: translateX(-100px) rotate(90deg);
opacity: 0;
filter: grayscale(1);
font-weight: 700;
width: 40px;
border-radius: 50%;
display: flex;
height: 40px;
align-items: center;
justify-content: center;
background: ${color.green};
animation: ${arrowAnimationDown} 3s linear 1.75s forwards;
margin-bottom: 20px;
@media ${device.laptop} {
	margin: auto 24px;
	transform: translateX(-100px) rotate(0deg);
	animation: ${arrowAnimation} 3s linear 1.75s forwards;

}
`;

export const CustomSwiper = styled.div`
	color: ${color.green};
	font-weight: 700;
`;





