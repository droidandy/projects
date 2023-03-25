import React from "react";

import {
	Section,
	WhyJoinList,
	WhyJoinItem,
	WhyJoinImageContainer,
	WhyJoinTitle,
	WhyJoinText,
} from "./styles";

// Images
import WhyJoin1Image from './why_join1_img';
import WhyJoin2Image from './why_join2_img';
import WhyJoin3Image from './why_join3_img';
import WhyJoin4Image from './why_join4_img';

// Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle"

function WhyJoinTaxgigSection(props) {

	const { general } = props;
	const { isPro } = general;

	return (
		<Section>
			<TitleWithSubtitle title="Why join TaxGig?" subtitle="Benefits of gig economy at your hand." dark={isPro} />
			<WhyJoinList>
				<WhyJoinItem>
					<WhyJoinImageContainer><WhyJoin1Image /></WhyJoinImageContainer>
					<div>	
						<WhyJoinTitle>Be your own boss</WhyJoinTitle>
						<WhyJoinText>Maintain your work-life balance and work with clients you like.</WhyJoinText>
					</div>
				</WhyJoinItem>
				<WhyJoinItem>
					<WhyJoinImageContainer><WhyJoin2Image /></WhyJoinImageContainer>
					<div>	
						<WhyJoinTitle>Focus on your work </WhyJoinTitle>
						<WhyJoinText>We’ll  bring you new clients that match your skills and preferences. Don’t waste time on search anymore.</WhyJoinText>
					</div>
				</WhyJoinItem>
				<WhyJoinItem>
					<WhyJoinImageContainer><WhyJoin3Image /></WhyJoinImageContainer>
					<div>	
						<WhyJoinTitle>Earn as much as you deserve</WhyJoinTitle>
						<WhyJoinText>No more fixed salaries - YOU define the price for your service.</WhyJoinText>
					</div>
				</WhyJoinItem>
				<WhyJoinItem>
					<WhyJoinImageContainer><WhyJoin4Image /></WhyJoinImageContainer>
					<div>	
						<WhyJoinTitle>Forget about scam </WhyJoinTitle>
						<WhyJoinText>Don’t pay for quotes. Instant access to real clients and their needs.</WhyJoinText>
					</div>
				</WhyJoinItem>
			</WhyJoinList>
		</Section>
	);
}

export default WhyJoinTaxgigSection;
