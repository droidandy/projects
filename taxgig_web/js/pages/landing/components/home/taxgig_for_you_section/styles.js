import styled from "styled-components";

import { color, device, f_c_sb } from "../../../../../components/styles";

export const Section = styled.div`
	padding-top: 72px;

	@media ${device.laptop} {
		padding-top: 104px;
	}
`;

export const SituationsBlocks = styled.div`
	display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
	flex-direction: column;
    align-items: center;
    background-image: none;
    margin-top: 56px;
    

    @media ${device.laptop} {
		flex-direction: row;
		align-items: flex-start;
		background-image: url(./js/pages/landing/components/home/taxgig_for_you_section/green_spot.svg);
   		background-repeat: no-repeat;
    	background-position: center center;
	}
`;

export const Situation = styled.div`
	max-width: 588px;
	width: 100%;
	margin-bottom: 0;
	flex-basis: calc(50% - 12px);
    background-color: #fff;
    border-radius: 10px;
    transition: all 0.3s ease;
    box-shadow: 4px 9px 24px rgba(180, 180, 208, 0.1);
    box-sizing: border-box;
    display: flex;
    padding: 32px;
    margin-bottom: 24px;
    flex-direction: column;
    box-shadow: 4px 8px 8px rgba(98, 107, 126, 0.07);

	@media ${device.laptop} {
		flex-direction: row;
	}

	@media ${device.laptop}	{
		&:nth-child(2) {
			margin-top: 30px;
		}
	}

	@media ${device.laptop} {
		&:nth-child(3){
			margin-top: -48px;
		}
	}

	&:hover {
		box-shadow: 8px 20px 30px rgba(98, 107, 126, 0.1);
	}
`;

export const SituationImageContainer = styled.div`
	margin-right: 0;
    margin-bottom: 32px;

	@media ${device.laptop} {
		margin-right: 46px;
	}

`

export const SituationTitle = styled.h3`
	font-size: 18px;
    line-height: 30px;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: #292F42;
`

export const SituationText = styled.p`
	color: ${color.darkGrey};
    margin-top: 16px;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0.5px;
`
export const SituationLink = styled.a`
	cursor: pointer;
	display: inline-block;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 600;
    color: ${color.grey};
    margin-top: 24px;
    font-size: 12px;
    line-height: 20px;
	letter-spacing: 0.3px;
    transition: .3s;

	&:hover {
		color: ${color.green};
	}
`



