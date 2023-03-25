import React from "react";
import { useHistory } from "react-router-dom";

import { NotFoundContainer, NotFoundSubtitle, NotFoundImgContainer, BackToHomeButton } from "./styles";

import NotFoundImg from './img';

function Message(props) {
	const history = useHistory();

	function goToHome() {
		 history.push("/");
	}

	return (
		<NotFoundContainer>
			<NotFoundImgContainer><NotFoundImg /></NotFoundImgContainer>
			<NotFoundSubtitle>
				We are sorry for the inconvenience.
			</NotFoundSubtitle>
			<NotFoundSubtitle>
				It looks like you're trying to access a page that either has
				been deleted or never even existed.
			</NotFoundSubtitle>
			<BackToHomeButton onClick={goToHome}>
				Back to Home
			</BackToHomeButton>
		</NotFoundContainer>
	);
}

export default Message;
