import React from 'react';
import styled from 'styled-components/native';
import { CustomText, Icons } from '../../index';
import FeedCard, { IFeedCardProps } from '../FeedCard';
import { deviceHeight, deviceWidth } from '../../../../utils/dimensions';

interface IProps extends IFeedCardProps {
	text: string;
}
const PlainNotification: React.FC<IProps> = props => {
	const { text } = props;

	return (
		<S.Container creationDate={props.creationDate}>
			<S.BellIcon />
			<CustomText text={text} size='s14' />
		</S.Container>
	);
};

const S: any = {};
S.Container = styled(FeedCard)``;

S.BellIcon = styled(Icons.BellIcon)`
	position: absolute;
	right: ${deviceWidth * 0.05};
	top: ${deviceHeight * 0.031};
`;

export default PlainNotification;
