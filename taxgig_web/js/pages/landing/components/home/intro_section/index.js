import React, { useLayoutEffect, useState } from "react";

import {
	Section,
	LeftBlock,
	LeftBlockTitle,
	LeftBlockText,
	LeftBlockBtn,
	RightBlock
} from "./styles";

// Images
import IntroImage from "./img";

// Components
import SubscribeButton from "../../subscribe_button";

function IntroSection(props) {
	const { dispatch, general, landing } = props;
	const { isMobile } = general;
	
	return (
		<Section>
			<LeftBlock>
				<LeftBlockTitle>
					Freelance Pros for any tax needs
				</LeftBlockTitle>
				<LeftBlockText>
					Whether you need a tax return, a monthly bookkeeping or any
					other financial high-qualified service, TaxGig is the best
					place to resolve each of your concerns by instantly matching
					you with a Pro.
				</LeftBlockText>
				<LeftBlockBtn>
					<SubscribeButton landing={landing} dispatch={dispatch} general={general} />
				</LeftBlockBtn>
			</LeftBlock>
			{!isMobile ? (
				<RightBlock>
					<IntroImage alt={'Taxgig. find accountant'} />
				</RightBlock>
			) : null}
		</Section>
	);
}

export default IntroSection;
