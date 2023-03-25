import React, { useState } from "react";

import {
	Container,
	InputTitle,
	Input,
	ContainerInfo,
	ContainerHint,
	HintText
	
} from "./styles";

import Info from "../../../../../components/images/info"

function CalcInput(props) {

const { title, hint, inputValue, setInputValue } = props;

const [isHintActive, setIsHintActive] = useState(false);

	return (
		<Container>
			<InputTitle>{title}</InputTitle>
			<Input placeholder="0" onChange={setInputValue} type="number" /> 
			<ContainerInfo onMouseOver={() => setIsHintActive(true)} onMouseOut={() => setIsHintActive(false)}><Info /></ContainerInfo>
			{isHintActive ? (
				<ContainerHint>
					<HintText>{hint}</HintText>
				</ContainerHint>
				) : null
			}
		</Container>
	);
}


export default CalcInput;