import React, {Fragment, useLayoutEffect, useState} from "react";

import {
	Section,
	CalendlyContainer
} from "./styles";
import "./calendly.css"; 
import { InlineWidget } from "react-calendly";
// Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";
import Helmet from "react-helmet";


function CalendlySection(props) {
	const el = document.querySelector("meta[name='description']");
	el.setAttribute('content', '');

	return (
		<Fragment>
			<Helmet>
				<title>{"TaxGig Inc. - Free consiltation"}</title>
			</Helmet>
			<Section>
				<CalendlyContainer>
					<InlineWidget url="https://calendly.com/taxgig/15min?month=2021-12" />
				</CalendlyContainer>
			</Section>
		</Fragment>
	);
}

export default CalendlySection;
