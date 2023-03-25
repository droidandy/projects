import React from "react";

import {
	Section,
	ReadySectionTitle,
	BlockBtn
} from "./styles";

// Components
import TrackRefundButton from "../track_refund_button";

function ReadyToUseSection(props) {
	return (
		<Section>
			<ReadySectionTitle>Ready to use all the benefits of our service?</ReadySectionTitle>
			<BlockBtn>
				<TrackRefundButton to="https://www.irs.gov/refunds" innerText="Track My Refund" />
			</BlockBtn>
		</Section>
	);
}

export default ReadyToUseSection;
