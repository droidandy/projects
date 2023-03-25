import {
    curry
} from 'lodash/fp';

export const SET_RANGE_DATE = 'UI/DATE_RANGE_PICKER/SET_RANGE_DATE';

export const setRangeDate = curry(
    (from, to) => ({
        type: SET_RANGE_DATE,
        payload: {from, to}
    })
);
