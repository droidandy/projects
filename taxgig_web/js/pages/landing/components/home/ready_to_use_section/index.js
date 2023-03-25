import React, { useLayoutEffect, useState } from "react";

import {
	Section,
	ReadySectionTitle,
	BlockBtn
} from "./styles";

// Components
import SubscribeButton from "../../subscribe_button";

function ReadyToUseSection(props) {

	const { dispatch, landing, general } = props;

	return (
		<Section>
			<ReadySectionTitle>Ready to use all the benefits of our service?</ReadySectionTitle>
			<BlockBtn>
				<SubscribeButton landing={landing} dispatch={dispatch} general={general} />
			</BlockBtn>
		</Section>
	);
}

export default ReadyToUseSection;
