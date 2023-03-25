import React, {Fragment, useLayoutEffect, useState} from "react";

import {
	Section,
	LeftBlock,
	LeftBlockTitle,
	LeftBlockText,
	LeftBlockBtn,
	RightBlock
} from "./styles";

import { size } from "../../../../../components/styles";

// Images
import IntroImage from "./img";

// Components
import SubscribeButton from "../../subscribe_button";
import Helmet from "react-helmet";

// Components
//import FilledButtonWithInput from "../../../../../components/buttons/filled_button_with_input";

function IntroSection(props) {
	const { dispatch, landing, general } = props;
	const { isPro } = general;
	const [deviceWidth, setDeviceWidth] = useState(0);

	useLayoutEffect(() => {
		function updateSize() {
			setDeviceWidth(window.innerWidth);
		}

		window.addEventListener("resize", updateSize);
		updateSize();
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	const el = document.querySelector("meta[name='description']");
	el.setAttribute('content', 'Join the best online marketplace for tax related services. No sign up fees. No hierarchy.');

	return (
		<Fragment>
			<Helmet>
				<title>{"TaxGig Inc. - Be the Pro your client needs"}</title>
			</Helmet>
			<Section>
				<LeftBlock>
					<LeftBlockTitle>
						Be the Pro your client needs
					</LeftBlockTitle>
					<LeftBlockText>
						Join the best online marketplace for tax related services. No sign up fees. No hierarchy.
					</LeftBlockText>
					<LeftBlockBtn>
						<SubscribeButton landing={landing} dispatch={dispatch} general={general} />
					</LeftBlockBtn>
				</LeftBlock>
				{deviceWidth > size.laptop - 1 ? (
					<RightBlock>
						<IntroImage />
					</RightBlock>
				) : null}
			</Section>
		</Fragment>
	);
}

export default IntroSection;
