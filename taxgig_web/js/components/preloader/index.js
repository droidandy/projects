import React from "react";

import { Block, Wrapper, Container, Logo } from "./styles";

import LogoGreen from "../images/logo_green";

function Preloader(props) {
	return (
		<Block>
			<Container>
				<Logo>
					<LogoGreen />
				</Logo>
			</Container>
		</Block>
	);
}

export default Preloader;
