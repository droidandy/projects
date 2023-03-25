import React, {Fragment, useLayoutEffect, useState} from "react";

import {
	Section,
	AboutBox,
	AboutLeftBlock,
	AboutRightBlock,
	AboutText,
	AboutParagraph
} from "./styles";

// Images
import AboutImage from "./img";

// Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";
import Helmet from "react-helmet";

function AboutSection(props) {

	const el = document.querySelector("meta[name='description']");
	el.setAttribute('content', 'TaxGig values your time the most. Instead of wasting thousands of hours on your taxes, we offer an opportunity to make them right, fast and at a fair price. We are the bridge between you and your Pro. Through our service, we offer to delegate the most sensitive and most painful part of life to the people who are the most qualified to deal with it.');

	return (
		<Fragment>
			<Helmet>
				<title>{"TaxGig Inc. - About us"}</title>
			</Helmet>
			<Section>
				<AboutLeftBlock>
					<TitleWithSubtitle title="About Us" subtitle="TaxGig is the online marketplace for tax related services founded on the principles and benefits of the gig economy." />
					<AboutText>
						<AboutParagraph>TaxGig values your time the most. Instead of wasting thousands of hours on your taxes, we offer an opportunity to make them right, fast and at a fair price. We are the bridge between you and your Pro. Through our service, we offer to delegate the most sensitive and most painful part of life to the people who are the most qualified to deal with it.</AboutParagraph>
						<AboutParagraph>Through technology, we empower Pros to have more choice, control and autonomy over their work, by being their own boss and earning what they deserve.</AboutParagraph>
						<AboutParagraph>It’s time to Gig tax economy together !</AboutParagraph>
					</AboutText>
				</AboutLeftBlock>
				<AboutRightBlock>
					<AboutImage />
				</AboutRightBlock>
			</Section>
		</Fragment>
	);
}

export default AboutSection;
