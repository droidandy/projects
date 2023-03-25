import React from 'react';
import styled from 'styled-components/native';
import { deviceHeight, deviceWidth } from '../../../utils/dimensions';
import { IChildren, IStyle } from '../../../types/interfaces';
import { CustomText } from '../index';
import { formatDistance } from 'date-fns';

export interface IFeedCardProps extends IChildren, IStyle {
	creationDate: number | Date;
}

const FeedCard: React.FC<IFeedCardProps> = props => {
	const { style } = props;
	return (
		<S.Container style={style}>
			<S.Date
				text={formatDistance(props.creationDate, new Date())}
				color='darkerBlue1'
				bold
				size='s11'
			/>
			{props.children}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	background-color: ${({ theme }) => theme.colors.mainBackgroundColor};
	padding-vertical: ${deviceHeight * 0.04};
	padding-horizontal: ${deviceWidth * 0.083};
	width: 100%;
	border-radius: 18px;
	margin-bottom: ${deviceHeight * 0.03125};
`;

S.Date = styled(CustomText)`
	margin-bottom: ${deviceHeight * 0.03};
`;

export default FeedCard;
