import React, { useMemo } from 'react';
import styled from 'styled-components/native';
import { PaddingHorizontalContainer } from '../index';
import CreatedNewOppNotification from './Notifications/CreatedNewOppNotification';
import PlainNotification from './Notifications/PlainNotification';
import NewIntroNotification from './Notifications/NewIntroNotification';
import { formatRelative, startOfDay, subDays } from 'date-fns';
import { DynamicObject } from '../../../types/interfaces';
import SectionHeader, {
	SectionHeaderText
} from '../../OppOverview/OppOverview/SectionHeader';
import { deviceHeight } from '../../../utils/dimensions';

enum NotificationTypesEnum {
	ALERT,
	NEW_INTRO,
	CREATED_NEW_OPP
}

const TEMP_NOTIFICATIONS = [
	{
		text:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		date: subDays(new Date(), 1),
		type: NotificationTypesEnum.ALERT
	},
	{
		text:
			'Hi Alberto, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Viverra orci sagittis eu volutpat odio facilisis mauris.',
		fromUser: {
			avatar:
				'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
			firstName: 'Laura',
			lastName: 'Palmer'
		},
		type: NotificationTypesEnum.CREATED_NEW_OPP,
		date: subDays(new Date(), 2)
	},
	{
		type: NotificationTypesEnum.NEW_INTRO,
		date: subDays(new Date(), 2)
	}
];

interface IProps {
	withPaddingBottom?: boolean;
	backgroundColor?: string;
}

const NewsFeed: React.FC<IProps> = props => {
	const { withPaddingBottom, backgroundColor } = props;
	const _render = useMemo(() => {
		const datesMapper = TEMP_NOTIFICATIONS.reduce(
			(acc, currentNotification) => {
				const { date } = currentNotification;
				const key = startOfDay(date).toString();

				acc[key] = acc[key]
					? [...acc[key], { ...currentNotification }]
					: [{ ...currentNotification }];

				return acc;
			},
			{} as DynamicObject<any>
		);

		return Object.entries(datesMapper).map(([date, notifications], _index) => (
			<React.Fragment key={_index}>
				<SectionHeader>
					<SectionHeaderText
						text={formatRelative(new Date(date), new Date())}
					/>
				</SectionHeader>

				{notifications.map((notification: any, index: number) => {
					switch (notification.type) {
						case NotificationTypesEnum.ALERT:
							return (
								<PlainNotification
									key={index}
									text={notification.text!}
									creationDate={notification.date}
								/>
							);

						case NotificationTypesEnum.CREATED_NEW_OPP:
							return (
								<NewIntroNotification
									key={index}
									message={notification.text!}
									fromUser={notification.fromUser!}
									creationDate={notification.date}
								/>
							);

						case NotificationTypesEnum.NEW_INTRO:
							return (
								<CreatedNewOppNotification
									key={index}
									creationDate={notification.date}
								/>
							);

						default:
							return null;
					}
				})}
			</React.Fragment>
		));
	}, [TEMP_NOTIFICATIONS]);

	return (
		<S.Container
			withPaddingBottom={withPaddingBottom}
			backgroundColor={backgroundColor}
		>
			<PaddingHorizontalContainer style={{ width: '100%' }}>
				{_render}
			</PaddingHorizontalContainer>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	overflow: hidden;
	background-color: ${({ theme, backgroundColor }) =>
		backgroundColor || theme.colors.white};

	${({ withPaddingBottom }: Partial<IProps>) =>
		withPaddingBottom &&
		`
			padding-bottom: ${deviceHeight * 0.128125}
		`}
`;

export default NewsFeed;
