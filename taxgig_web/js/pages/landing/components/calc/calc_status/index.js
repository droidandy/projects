import React, { useState } from "react";

import {
	Container,
	StatusTitle,
	ContainerImage,
	ContainerInfo,
	GreenBorder,
	ContainerHint,
	HintText
} from "./styles";

import Info from "../../../../../components/images/info"

function CalcStatus(props) {

	const { image, status, id, setFilingStatus, isActive, hintText, isImageVisible, isHintVisible } = props;

	const [isHintActive, setIsHintActive] = useState(false);

	return (
		<Container id={id} onClick={setFilingStatus} isActive={isActive}>
			<ContainerImage isImageVisible={isImageVisible}>{image}</ContainerImage>
			<StatusTitle>{status}</StatusTitle>
			<ContainerInfo isHintVisible={isHintVisible} onMouseOver={() => setIsHintActive(true)} onMouseOut={() => setIsHintActive(false)}><Info /></ContainerInfo>
			{isHintActive ? (
				<ContainerHint>
					<HintText>{hintText}</HintText>
				</ContainerHint>
				) : null
			}
		</Container>
	);
}

export default CalcStatus;