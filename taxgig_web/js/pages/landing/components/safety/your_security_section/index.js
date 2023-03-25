import React from "react";

import {
	Section,
	YourSecurityBlock,
	YourSecurityBox,
	YourSecurityBoxLeft,
	YourSecurityTitle,
	YourSecurityText,
} from "./styles";

//import Press1Image from "./press1_img.js"
import YourSecurity1Image from "./your_security1_img"
import YourSecurity2Image from "./your_security2_img"
import YourSecurity3Image from "./your_security3_img"
import YourSecurity4Image from "./your_security4_img"

//Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";

function TaxgigInTheNewsSection(props) {

	return (
		<Section>
			<TitleWithSubtitle title="Your Security" subtitle="Trust and Security are our top priorities." />
			<YourSecurityBlock>
				<YourSecurityBox>
					<YourSecurity1Image />
					<YourSecurityTitle>Data Encryption</YourSecurityTitle>
					<YourSecurityText>We safeguard your information through full data encryption process.</YourSecurityText>
				</YourSecurityBox>
				<YourSecurityBox>
					<YourSecurity2Image />
					<YourSecurityTitle>Two factor authentication</YourSecurityTitle>
					<YourSecurityText>Use third party apps or secured email to prevent anyone else from accessing your profile.</YourSecurityText>
				</YourSecurityBox>
				<YourSecurityBox>
					<YourSecurity3Image />
					<YourSecurityTitle>Secure facilities</YourSecurityTitle>
					<YourSecurityText>Our data centers, networks and servers are safeguarded by the best security companies.</YourSecurityText>
				</YourSecurityBox>
				<YourSecurityBox>
					<YourSecurity4Image />
					<YourSecurityTitle>Security protection team</YourSecurityTitle>
					<YourSecurityText>We hired the best professionals to ensure the safety of your information 24/7.</YourSecurityText>
				</YourSecurityBox>				
			</YourSecurityBlock>
		</Section>
	);
}

export default TaxgigInTheNewsSection;