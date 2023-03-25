import React from "react";

import {
	Section,
	SituationsBlocks,
	Situation,
	SituationImageContainer,
	SituationTitle,
	SituationText,
	SituationLink
} from "./styles";

import LandingListForYou from "../../../../../components/images/landing_list_foryou"
import LandingBuildingForYou from "../../../../../components/images/landing_building_foryou"
import LandingEarth from "../../../../../components/images/landing_earth"
import LandingFreelancers from "../../../../../components/images/landing_freelancers"

//Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";

function TaxgigForYouSection(props) {

	return (
		<Section>
			<TitleWithSubtitle title="TaxGig is For You" subtitle="Our Pros have a variety of skills and are capable of dealing with both simple and complicated tax situations." />
			<SituationsBlocks>
				<Situation>
					<SituationImageContainer><LandingListForYou /></SituationImageContainer>
					<div>
						<SituationTitle>Regular filer</SituationTitle>
						<SituationText>Stop wasting hours on self-preparation and let the tax Pro do the job for you.</SituationText>
						<SituationLink href="/faq/category/A6B15DxBDelVWGhvc0/A6B15Dzf4QkZdxruTo">Learn more</SituationLink>
					</div>
				</Situation>
				<Situation>
					<SituationImageContainer><LandingBuildingForYou /></SituationImageContainer>
					<div>
						<SituationTitle>Small business owner</SituationTitle>
						<SituationText>The best business requires the best help. We match you with Pros who have the best skills and knowledge to help your business prosper.</SituationText>
						<SituationLink href="/faq/category/A6B15DxBDelVWGhvc0/A6B15E0N1nJjgACTaK">Learn more</SituationLink>
					</div>
				</Situation>
				<Situation>
					<SituationImageContainer><LandingEarth /></SituationImageContainer>
					<div>
						<SituationTitle>Non-resident alien, International student or an American working abroad</SituationTitle>
						<SituationText>These types of taxes are complicated and hard. Stop worrying about getting everything right and let our tax Pros help you out.</SituationText>
						<SituationLink href="/faq/category/A6B15DxBDelVWGhvc0/A6B15E0j0TbJhGMl8a">Learn more</SituationLink>
					</div>
				</Situation>
				<Situation>
					<SituationImageContainer><LandingFreelancers /></SituationImageContainer>
					<div>
						<SituationTitle>Self-employed, Freelancer, Uber/Lyft driver or Trucker</SituationTitle>
						<SituationText>When you have a lot going on in your life, the smartest choice is to hand your taxes to a Pro. Our pool of experts will help identify all deductions to let you get back to doing your business.</SituationText>
						<SituationLink href="/faq/category/A6B15DxBDelVWGhvc0/A6B15E1QxqATjShKF6">Learn more</SituationLink>
					</div>
				</Situation>
			</SituationsBlocks>
		</Section>
	);
}

export default TaxgigForYouSection;
