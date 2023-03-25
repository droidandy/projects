import React from "react";

import {
	Section,
	LeftBlock,
	LeftBlockTitle,
	LeftBlockText,
	RightBlock
} from "./styles";

// Images
import IntroImage from "./img";
import TrackRefundButton from "../track_refund_button";
function IntroSection(props) {
	return (
		<Section>
			<LeftBlock>
				<LeftBlockTitle>
					Track Your Refund
				</LeftBlockTitle>
				<LeftBlockText>
					Regardless of your filing method and location, it's super easy and absolutely free to track your refund. We'll provide a guide on how and where to track your refund. 
				</LeftBlockText>
				<TrackRefundButton to="https://www.irs.gov/refunds"  innerText="Track My Refund" />
			</LeftBlock>
			<RightBlock>
				<IntroImage alt={'track my tax refund'} />
			</RightBlock>
		</Section>
	);
}

export default IntroSection;
