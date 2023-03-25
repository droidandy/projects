import React from "react";

import {
	PressBox,
	PressImage,
	PressBoxLeft,
	PressBoxRight,
	PressAuthor,
	PressTitle,
	PressText,
	PressDate

} from "./styles";


function PressBoxItem (props) {

const { article } = props;
const { imgUrl, author, title, previewText, published_at, url} = article;
const date = published_at.split('T');
const article_date = date[0]

	return (
		<PressBox href={url} target="_blank">
			<PressBoxLeft><PressImage src={imgUrl} /></PressBoxLeft>
			<PressBoxRight>
				<PressAuthor>{author}</PressAuthor>
				<PressTitle>{title}</PressTitle>
				<PressText>{previewText}</PressText>
				<PressDate>{article_date}</PressDate>
			</PressBoxRight>
		</PressBox>
	);
}

export default PressBoxItem;
