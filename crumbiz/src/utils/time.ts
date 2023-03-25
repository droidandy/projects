import { format } from 'date-fns';

export const getDateFormat = (timestamp: string) => {
	const date = new Date(timestamp);
	const formated = format(date, 'MM/dd/yyyy');
	return formated;
};
