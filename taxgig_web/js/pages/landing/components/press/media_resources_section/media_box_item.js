import React from "react";

import {
	MediaBox,
	MediaTitle,
	MediaText,
	MediaButton
} from "./styles";


function MediaBoxItem (props) {

const { title, text, url } = props;
	return (
		<MediaBox href={`/api${url}`} target="_blank">
			<MediaTitle>{title}</MediaTitle>
			<MediaText>{text}</MediaText>
			<MediaButton>DOWNLOAD</MediaButton>
		</MediaBox>
	);
}

export default MediaBoxItem;
