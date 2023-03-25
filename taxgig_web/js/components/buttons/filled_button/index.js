import React from 'react';

import { Button } from './styles';


function FilledButton(props) {

	const { onClick, text } = props;

	return (
		<Button onClick={onClick}>
			{text}
		</Button>

	);
}

export default FilledButton;