import { format } from 'date-fns';
import { InteractionTypesEnum } from '../types/enums';
import { ISpecialInteractionUtilPayload } from '../types/interfaces';

const createInteractionBody = ({
	fromUsername,
	toUsername,
	type,
	calendarData
}: ISpecialInteractionUtilPayload) => {
	let formattedDate = '';
	if (calendarData?.startDate) {
		formattedDate = format(new Date(calendarData.startDate), 'yyyy-MM-dd');
	}

	const SpacielInteractionsMapper = {
		[InteractionTypesEnum.OPEN_CALL]: `${fromUsername} called ${toUsername}`,
		[InteractionTypesEnum.OPEN_SMS]: `${fromUsername} sent an sms to ${toUsername}`,
		[InteractionTypesEnum.OPEN_EMAIL]: `${fromUsername} sent email to ${toUsername}`,
		[InteractionTypesEnum.OPEN_CALENDER]: `${fromUsername} set a meeting with ${toUsername} at ${formattedDate}`
	};

	//@ts-ignore
	return SpacielInteractionsMapper[type];
};

export default createInteractionBody;
