import moment from 'moment';
import {
    nth,
    head
} from 'lodash/fp';
import {
    SET_RANGE_DATE
} from 'actions/ui/dateRangePicker';
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
    DATERANGE_LASTMONTH_LABEL
} from 'models/dateRangePicker';
export const initialState = {
    ranges: {
        [DATERANGE_TODAY_LABEL]: DATERANGE_TODAY,
        [DATERANGE_YESTERDAY_LABEL]: DATERANGE_YESTERDAY,
        [DATERANGE_LAST7DAYS_LABEL]: DATERANGE_LAST7DAYS,
        [DATERANGE_LAST30DAYS_LABEL]: DATERANGE_LAST30DAYS,
        [DATERANGE_THISMONTH_LABEL]: DATERANGE_THISMONTH,
        [DATERANGE_LASTMONTH_LABEL]: DATERANGE_LASTMONTH
    },
    startDate: head(DATERANGE_LAST30DAYS),
    endDate: nth(1, DATERANGE_LAST30DAYS)
};

export function reducer(state, action) {
    const { type, payload } = action;
    switch (type) {
        case SET_RANGE_DATE: {
            return {
                ...state,
                startDate: payload.from ? payload.from : moment(),
                endDate: payload.to ? payload.to : moment()
            };
        }

        default: {
            return state;
        }
    }
}
