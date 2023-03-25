import React from "react";

import { Section, FaqListBlock } from "./styles";

//Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";
import FaqListItem from "../faq_list_item";

function FaqListSection(props) {
	const { faqCategories } = props;

	return (
		<Section>
			<FaqListBlock>
				{faqCategories.map(category => {
					return (
						<FaqListItem
							hover="yes"
							background="white"
							shadow="yes"
							key={category.id}
							id={category.id}
							title={category.title}
							count={category.faqs ? category.faqs.length : 0}
							text="Written by Taxgig team"
						/>
					);
				})}
			</FaqListBlock>
		</Section>
	);
}

export default FaqListSection;
