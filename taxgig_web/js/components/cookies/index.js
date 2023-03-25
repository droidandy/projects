import React from "react";

import {
	CookiesWrapper,
	CookiesContainer,
	ContainerButton,
	CookiesText,
	CookiesLink
} from "./styles";

import FilledButton from "../buttons/filled_button";

function Cookies(props) {
	const { onClick, isPro } = props;

	return (
		<CookiesContainer isPro={isPro}>
			<CookiesWrapper>
				<CookiesText isPro={isPro}>
					This site uses cookies and other tracking technologies to
					assist with navigation and your ability to provide feedback,
					analyse your use of our products and services, assist with
					our promotional and marketing efforts, and provide content
					from third parties.{" "}
					<CookiesLink to="/privacy">
						Use of cookies.
					</CookiesLink>
				</CookiesText>
				<ContainerButton>
					<FilledButton text="Accept Cookies" onClick={onClick} />
				</ContainerButton>
			</CookiesWrapper>
		</CookiesContainer>
	);
}

export default Cookies;
