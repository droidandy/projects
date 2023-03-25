import React, { FC, useEffect } from 'react';
import styled from 'styled-components/native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import RNCalendarEvents from 'react-native-calendar-events';
import store from '../../../store/store';
import { sendSpacielInteraction } from '../../../store/actions/oppOverviewActions';
import { InteractionTypesEnum } from '../../../types/enums';

interface IProps {}

export const openCalendarAndFetchEventData = async (
	entityUserName: string,
	targetId: string
) => {
	AddCalendarEvent.presentEventCreatingDialog({ title: 'New event' })
		.then(
			// @ts-ignore
			(eventInfo: {
				calendarItemIdentifier: string;
				eventIdentifier: string;
				action: string;
			}) => {
				console.log(eventInfo);
				if (eventInfo.action === 'SAVED') {
					// Put integration here
					RNCalendarEvents.authorizationStatus()
						.then(() => {
							RNCalendarEvents.findEventById(eventInfo.calendarItemIdentifier)
								.then(data => {
									store.dispatch(
										sendSpacielInteraction({
											type: InteractionTypesEnum.OPEN_CALENDER,
											targetUsername: entityUserName,
											calendarData: data!,
											targetId
										})
									);
									console.log('[success]', data);
								})
								.catch(error => console.warn('[err]', error));
						})
						.catch(err => console.warn('[autherr]', err));
				}

				console.warn(JSON.stringify(eventInfo));
			}
		)
		.catch((error: string) => {
			console.warn(error);
		});
};

const TargetProfileCalendar: FC<IProps> = props => {
	// useEffect(openCalendarAndFetchEventData, []);

	return <></>;
};

const S: any = {};

export default TargetProfileCalendar;
