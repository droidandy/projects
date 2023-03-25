import moment from 'moment';
import {
    contains,
    curry,
    map,
    isEqual,
    split,
    compose,
    nth,
    head
} from 'lodash/fp';
import {
    DATERANGE_TODAY,
    DATERANGE_YESTERDAY,
    DATERANGE_LAST7DAYS,
    DATERANGE_LAST30DAYS,
    DATERANGE_THISMONTH,
    DATERANGE_LASTMONTH,
    DATERANGE_TODAY_LABEL,
    DATERANGE_YESTERDAY_LABEL,
    DATERANGE_LAST7DAYS_LABEL,
    DATERANGE_LAST30DAYS_LABEL,
    DATERANGE_THISMONTH_LABEL,
    DATERANGE_LASTMONTH_LABEL,
    DATERANGE_CUSTOMRANGE_LABEL
} from 'models/dateRangePicker';

export function formatDate(date) {
    return moment(date).format('MMM Do');
}

export function formatDateTime([ date, time ]) {
    return moment(`${date}T${time}`).format('MMM D HH:mm');
}

export const getISOStringFromDate = date => new Date(date).toISOString();

const getFormatString = curry(date => date.format('YYYY-MM-DD'));
const getFormatFromDateRange = dateRange => map(item => (getFormatString(item)), dateRange);
const containDate = curry(
    (date, dateRange) => contains(
        getFormatString(date),
        getFormatFromDateRange(dateRange)
    )
);
const checkDates = curry(
    (startDate, endDate, dateRange) => (
        containDate(startDate, dateRange) &&
        containDate(endDate, dateRange)
    )
);

const ternaryLabel = curry((condition, fnLeft, fnRight) => (condition ? fnLeft : fnRight));

export const formatDateLabel = curry(
    (startDate, endDate) => (
        ternaryLabel(!checkDates(startDate, endDate, DATERANGE_TODAY),
            ternaryLabel(!checkDates(startDate, endDate, DATERANGE_YESTERDAY),
                ternaryLabel(!checkDates(startDate, endDate, DATERANGE_LAST7DAYS),
                    ternaryLabel(!checkDates(startDate, endDate, DATERANGE_LAST30DAYS),
                        ternaryLabel(!checkDates(startDate, endDate, DATERANGE_THISMONTH),
                            ternaryLabel(!checkDates(startDate, endDate, DATERANGE_LASTMONTH),
                                (DATERANGE_CUSTOMRANGE_LABEL), (DATERANGE_LASTMONTH_LABEL)),
                            (DATERANGE_THISMONTH_LABEL)),
                        (DATERANGE_LAST30DAYS_LABEL)),
                    (DATERANGE_LAST7DAYS_LABEL)),
                (DATERANGE_YESTERDAY_LABEL)),
            (DATERANGE_TODAY_LABEL))
    )
);
const splitHyphen = split('-');
const dateArrayYMD = compose(
    splitHyphen,
    getFormatString
);
export const intervalLabel = curry(
    (startDate, endDate) => (
        ternaryLabel((isEqual(head(dateArrayYMD(startDate)), head(dateArrayYMD(endDate))) &&
            isEqual(nth(1, dateArrayYMD(startDate)), nth(1, dateArrayYMD(endDate)))),
            (`${startDate.format('MMM')} ${startDate.format('D')}-${endDate.format('D')}, ${startDate.format('YYYY')}`),
            ternaryLabel(isEqual(head(dateArrayYMD(startDate)), head(dateArrayYMD(endDate))),
                (`${startDate.format('MMM D')} - ${endDate.format('MMM D')}, ${head(dateArrayYMD(startDate))}`),
                (`${startDate.format('MMM D, YYYY')} - ${endDate.format('MMM D, YYYY')}`)))
    )
);
export const dateLabel = curry(
    (startDate, endDate) => (
        isEqual(getFormatString(startDate), getFormatString(endDate)) ?
            (startDate.format('MMM D, YYYY')) : intervalLabel(startDate, endDate)
    )
);
