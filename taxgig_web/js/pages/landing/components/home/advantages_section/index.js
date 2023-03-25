import React from "react";

import {
	Section,
	AdvantagesList,
	AdvantagesItem,
	AdvantagesImageContainer,
	AdvantagesTitle,
	AdvantagesText,
} from "./styles";

// Images
import Advantages1Image from './advantages1_img';
import Advantages2Image from './advantages2_img';
import Advantages3Image from './advantages3_img';
import Advantages4Image from './advantages4_img';
import Advantages5Image from './advantages5_img';
import Advantages6Image from './advantages6_img';


// Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";


function AdvantagesSection(props) {

	return (
		<Section>
			<TitleWithSubtitle title="Advantages" subtitle="Benefits of gig economy at your hands!" />
			<AdvantagesList>
				<AdvantagesItem>
					<AdvantagesImageContainer><Advantages1Image /></AdvantagesImageContainer>
					<div>	
						<AdvantagesTitle>Have a freedom of choice</AdvantagesTitle>
						<AdvantagesText>You decide with whom to work - browse through the best offers or get instantly matched to one of our top Pros.</AdvantagesText>
					</div>
				</AdvantagesItem>
				<AdvantagesItem>
					<AdvantagesImageContainer><Advantages2Image /></AdvantagesImageContainer>
					<div>	
						<AdvantagesTitle>Simplify your preparation</AdvantagesTitle>
						<AdvantagesText>Answer simple questions and upload your documents - let your Pro do the rest.</AdvantagesText>
					</div>
				</AdvantagesItem>
				<AdvantagesItem>
					<AdvantagesImageContainer><Advantages3Image /></AdvantagesImageContainer>
					<div>	
						<AdvantagesTitle>Work with verified Pros</AdvantagesTitle>
						<AdvantagesText>Every tax expert is vetted and background checked via IRS Directory.</AdvantagesText>
					</div>
				</AdvantagesItem>
				<AdvantagesItem>
					<AdvantagesImageContainer><Advantages4Image /></AdvantagesImageContainer>
					<div>	
						<AdvantagesTitle>Save money</AdvantagesTitle>
						<AdvantagesText>We match you with Pros free of charge. Receive upfront offers from them and choose the one that suits you the most.</AdvantagesText>
					</div>
				</AdvantagesItem>
				<AdvantagesItem>
					<AdvantagesImageContainer><Advantages5Image /></AdvantagesImageContainer>
					<div>	
						<AdvantagesTitle>Don’t waste time on search</AdvantagesTitle>
						<AdvantagesText>With the help of AI, you will be matched only to the Pros who suit your needs.</AdvantagesText>
					</div>
				</AdvantagesItem>
				<AdvantagesItem>
					<AdvantagesImageContainer><Advantages6Image /></AdvantagesImageContainer>
					<div>	
						<AdvantagesTitle>Your taxes in one place</AdvantagesTitle>
						<AdvantagesText>Integrate all your returns and statements in a single safeguarded place to ease your tax preparation for years to come.</AdvantagesText>
					</div>
				</AdvantagesItem>
			</AdvantagesList>
		</Section>
	);
}

export default AdvantagesSection;
