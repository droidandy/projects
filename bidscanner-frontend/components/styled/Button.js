// @flow
import { Button } from 'reactstrap';

import styled from 'styled-components';

const GeneralButton = styled(Button)`
	font-size: 1em;
	padding: 0.5em 1em;
	border: 1px solid black;
	color: black;
	font-weight: bold;
	border-radius: 0px;

	&:hover {
		color: black;
		background-color: white;
	}
`;

export default GeneralButton;
