import React, {Fragment} from "react";

import {
	Section,
	SafetyBlock,
	SafetyText,
} from "./styles";

//Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";
import Helmet from "react-helmet";

function MediaResourcesSection(props) {

	const el = document.querySelector("meta[name='description']");
	el.setAttribute('content', 'You trust us with some of your most important information and documents and we take that responsibility very seriously.');

	return (
		<Fragment>
			<Helmet>
				<title>{"TaxGig Inc. - Safety"}</title>
			</Helmet>
			<Section>
				<TitleWithSubtitle title="Safety" subtitle="Data Security is important to us." />
				<SafetyBlock>
					<SafetyText>
						You trust us with some of your most important information and documents and we take that responsibility very seriously. We are committed to protecting your personal data from unauthorized access. We combine several layers of security technologies and policies to safeguard your most sensitive information.
					</SafetyText>
				</SafetyBlock>
			</Section>
		</Fragment>
	);
}

export default MediaResourcesSection;
