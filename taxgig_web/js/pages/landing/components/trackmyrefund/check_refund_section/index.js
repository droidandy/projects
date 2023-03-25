import React from "react";

import {
	Section,
	LeftBlock,
	LeftBlockTitle,
	LeftBlockText,
	RightBlock
} from "./styles";

import IntroImage from "./img";
import TrackRefundButton from "../track_refund_button";

function IntroSection(props) {
	return (
		<Section>
			<RightBlock>
				<IntroImage alt={'Check my refund status'} />
			</RightBlock>
			<LeftBlock>
				<LeftBlockTitle>
					Check Your Refund Status
				</LeftBlockTitle>
				<LeftBlockText>
					Regardless of the filing method, you can begin tracking your refund through the official IRS website. Simply go to irs.gov/refunds to check your refund status, after receiving a return confirmation email.
				</LeftBlockText>
				<TrackRefundButton to="https://www.irs.gov/refunds" innerText="Track My Refund" />
			</LeftBlock>
		</Section>
	);
}

export default IntroSection;
