import React from "react";

import {
	Section,
	ContainerButton
	
} from "./styles";

//Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";
import FilledButtonArrowRight from "../../../../../components/buttons/filled_button_arrow_right";

function FaqFooterSection(props) {

	return (
		<Section>
			<TitleWithSubtitle title="Did not find the answer?" subtitle="You can email us and describe your problem." />
			<ContainerButton>
				<FilledButtonArrowRight innerText="I need Help"/>
			</ContainerButton>
		</Section>
	);
}

export default FaqFooterSection;