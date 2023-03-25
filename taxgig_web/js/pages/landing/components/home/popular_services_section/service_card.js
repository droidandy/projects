import React from "react";

import {
	Card,
	CardContent,
	CardImg,
	CardTitle,
	CardSubtitle,
	CardSubtitleWrapper,
	CardPaginationWrapper,
	CardPrice
} from "./styles";

function ServiceCard(props) {
	const { img, title, price } = props;

	return (
		<Card>
			<CardContent>
				<CardImg>{img}</CardImg>
				<CardTitle>{title}</CardTitle>
				<CardSubtitleWrapper>
					<CardSubtitle>Starting from</CardSubtitle>
					<CardPrice>{price}</CardPrice>
				</CardSubtitleWrapper>
			</CardContent>
			<CardPaginationWrapper />
		</Card>
	);
}

export default ServiceCard;
