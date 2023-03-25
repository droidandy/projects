import React from "react";
import Pagination from "material-ui-flat-pagination";
import { useHistory } from "react-router-dom";

import {
	Section,
	CareersListBlock,
} from "./styles";

//Components
import TitleWithSubtitle from "../../../../../../components/texts/title_with_subtitle";
import CareersItem from "../careers_item";


function CareersListSection(props) {

	const { vacancies } = props;
	const history = useHistory();

	console.log(vacancies)

	function handleClick(id) {
  	history.push(`/careers/${id}`);
  }

	return (
		<Section>
			<TitleWithSubtitle title="Be a part of an amazing story" subtitle="Here is the list of open job positions we currently have." />
			<CareersListBlock>
				{vacancies.map(vacancy => {
					return (
						<CareersItem
							key={vacancy.id}
							id={vacancy.id}
							category={vacancy.type}
							position={vacancy.title}
							shortDescription={vacancy.summary.substring(0,123)}
							onClick={handleClick}
							/>
					)
				})}
			</CareersListBlock>
		</Section>
	);
}

export default CareersListSection;
