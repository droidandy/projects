import React from "react";

import {
	Container,
	CareersCategory,
	CareersPosition,
	CareersText,
	CareersShortDescription,
	CareersOutlinedButton
} from "./styles";


function CareersItem(props)  {
	const {category, position, shortDescription, id, onClick} = props;

	return (
		<Container>
			<CareersCategory>{category}</CareersCategory>
			<CareersPosition>{position}</CareersPosition>
			<CareersText>Minimum qualifications:</CareersText>
			<CareersShortDescription>{shortDescription}</CareersShortDescription>
			<CareersOutlinedButton onClick={() => onClick(id)} >Learn more</CareersOutlinedButton>
		</Container>
	);
}

export default CareersItem;