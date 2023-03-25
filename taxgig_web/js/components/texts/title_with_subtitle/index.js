import React, { Fragment } from 'react';

import { Title, Subtitle } from './styles';

function TitleWithSubtitle(props) {

	const { title, subtitle, dark } = props;

	return(
		<Fragment>
			<Title>{title}</Title>
			<Subtitle dark={dark}>{subtitle}</Subtitle>
		</Fragment>
	);
}

export default TitleWithSubtitle;