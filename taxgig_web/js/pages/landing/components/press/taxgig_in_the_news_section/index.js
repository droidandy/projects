import React from "react";

import { Section, PressBlock } from "./styles";

//Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";
import PressBoxItem from "./press_box_item";

function TaxgigInTheNewsSection(props) {
	const { pressArticles } = props;
	
	return (
		<Section>
			<TitleWithSubtitle
				title="TaxGig in the News"
				subtitle="See what other sources say about us."
			/>
			<PressBlock>
				{pressArticles.map(article => {
					return <PressBoxItem key={article.id} article={article} />;
				})}
			</PressBlock>
		</Section>
	);
}

export default TaxgigInTheNewsSection;
