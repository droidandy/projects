import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import FeedCard, { IFeedCardProps } from '../FeedCard';
import { CustomText } from '../../index';

interface IProps extends IFeedCardProps {}
const CreatedNewOppNotification: React.FC<IProps> = props => {
	const { t } = useTranslation();

	return (
		<S.Container creationDate={props.creationDate}>
			<S.Text
				text={t('oppOverview.oppOverview.tabs.newsFeed.notifications.newOpp')}
				bold
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled(FeedCard)`
	background-color: ${({ theme }) => theme.colors.paleBlue1};
`;

S.Text = styled(CustomText)`
	max-width: 52.8%;
`;

export default CreatedNewOppNotification;
