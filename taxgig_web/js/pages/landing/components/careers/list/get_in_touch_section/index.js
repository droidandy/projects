import React from "react";

import {
	Section,
	ContainerButton
} from "./styles";

//Components
import TitleWithSubtitle from "../../../../../../components/texts/title_with_subtitle";
import FilledButtonArrowRight from "../../../../../../components/buttons/filled_button_arrow_right";

function GetInTouchSection(props) {

	return (
		<Section>
			<TitleWithSubtitle title="Don’t see how you fit in?" subtitle="No worries, get in touch and tell us more about yourself and your interests. We are always open for talented people striving to make an impact." />
			<ContainerButton>
				<FilledButtonArrowRight innerText="I need Help"/>
			</ContainerButton>
		</Section>
	);
}

export default GetInTouchSection;