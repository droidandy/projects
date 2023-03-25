import React from 'react';
import { StatusBar as _StatusBar } from 'react-native';
import { getColorBrightness } from '../../utils';

interface IProps {
	backgroundColor: string;
}

const StatusBar: React.FC<IProps> = props => {
	const barStyle =
		getColorBrightness(props.backgroundColor) > 150
			? 'dark-content'
			: 'light-content';

	return (
		<_StatusBar
			animated
			backgroundColor={props.backgroundColor}
			barStyle={barStyle}
		/>
	);
};

export default StatusBar;
